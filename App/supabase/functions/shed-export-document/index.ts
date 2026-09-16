// AskPIP Garden Shed — Format Legal Docs export
//
// Server-side only, called by the Shed's "Format Legal Docs" Toolbox tool
// (Shed/source/template.html, openFormatLegalDocsTool). Takes a document's
// title/body text and returns it as a formatted .docx or .pdf file matching
// Karla's legal-formatting spec (`shed_items` id 2025, 14 September 2026):
//
//   - Margins: 2.54cm / 1 inch on all four sides
//   - Font: Times New Roman, 12pt body text
//   - Line spacing: 1.5
//   - Paragraph spacing: 0pt before/after
//   - Page numbers: bottom of the page, centred
//   - Top header: document title (left) + author (right)
//   - NZ English: about the source content's own spelling, not something
//     this tool converts — nothing to do here.
//
// Two things in her spec were ambiguous and were resolved with the most
// reasonable reading rather than guessed at silently (flagged to the
// Founder when this shipped, 17 September 2026):
//   - "1.5 cm Line spacing" is read as ordinary 1.5 line spacing, not a
//     literal 1.5cm measurement.
//   - No separate title page is generated, so page numbering always starts
//     at page 1 — her spec branches on a title page's presence without
//     saying which documents warrant one.
//
// The Shed has no real Supabase Auth (two named passphrases only, see
// Shed/README.md "Backend") — this function validates the caller the same
// way every shed_* RPC does, via shed_check_passphrase, rather than
// requiring a user JWT. Deployed with verify_jwt=false for exactly that
// reason.
//
// Markdown support is deliberately a practical subset, not a full parser:
// #/##/### headings, "- "/"* " bullet items, blank-line-separated
// paragraphs, and **bold** spans (docx only — see buildPdf's note on why
// PDF renders bold spans as a whole-block choice instead).

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import {
  AlignmentType,
  Document,
  Footer,
  Header,
  PageNumber,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
} from 'npm:docx@8.5.0'
import { PDFDocument, PDFFont, PDFPage, StandardFonts } from 'npm:pdf-lib@1.17.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const FONT_NAME = 'Times New Roman'
const AUTHOR = 'AskPIP Founder Authority'

// --- Shared minimal markdown block parser -----------------------------

type Block = { type: 'h1' | 'h2' | 'h3' | 'p' | 'li'; text: string }

function parseBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let buf: string[] = []
  function flush() {
    if (buf.length) {
      blocks.push({ type: 'p', text: buf.join(' ').trim() })
      buf = []
    }
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (line === '') {
      flush()
      continue
    }
    const h3 = line.match(/^###\s+(.*)/)
    const h2 = line.match(/^##\s+(.*)/)
    const h1 = line.match(/^#\s+(.*)/)
    const li = line.match(/^[-*]\s+(.*)/)
    const quote = line.match(/^>\s?(.*)/)
    if (h3) {
      flush()
      blocks.push({ type: 'h3', text: h3[1] })
    } else if (h2) {
      flush()
      blocks.push({ type: 'h2', text: h2[1] })
    } else if (h1) {
      flush()
      blocks.push({ type: 'h1', text: h1[1] })
    } else if (li) {
      flush()
      blocks.push({ type: 'li', text: li[1] })
    } else if (quote) {
      flush()
      blocks.push({ type: 'p', text: quote[1] })
    } else {
      buf.push(line)
    }
  }
  flush()
  return blocks
}

function parseInlineRuns(text: string): { text: string; bold: boolean }[] {
  const runs: { text: string; bold: boolean }[] = []
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  for (const part of parts) {
    if (!part) continue
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      runs.push({ text: part.slice(2, -2), bold: true })
    } else {
      runs.push({ text: part, bold: false })
    }
  }
  return runs.length ? runs : [{ text, bold: false }]
}

function stripInlineMarks(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1')
}

// --- .docx generation (npm:docx) ---------------------------------------
//
// 2.54cm = 1 inch = 1440 twips exactly, so the margin figure below is not
// a rounded approximation. A4 (210mm x 297mm) is used as the page size —
// Karla's spec didn't name a paper size; A4 is the NZ/AskPIP default
// assumption, flagged alongside the other two above.

const MARGIN_TWIPS = 1440
const PAGE_WIDTH_TWIPS = 11906
const PAGE_HEIGHT_TWIPS = 16838
const WRITABLE_WIDTH_TWIPS = PAGE_WIDTH_TWIPS - MARGIN_TWIPS * 2

async function buildDocx(title: string, body: string): Promise<Uint8Array> {
  const blocks = parseBlocks(body)
  const spacing = { before: 0, after: 0, line: 360, lineRule: 'auto' as const }

  function runsFor(text: string, size: number, forceBold: boolean) {
    return parseInlineRuns(text).map(
      (r) => new TextRun({ text: r.text, font: FONT_NAME, size, bold: forceBold || r.bold }),
    )
  }

  const children = blocks.map((b) => {
    if (b.type === 'h1') return new Paragraph({ children: runsFor(b.text, 32, true), spacing })
    if (b.type === 'h2') return new Paragraph({ children: runsFor(b.text, 28, true), spacing })
    if (b.type === 'h3') return new Paragraph({ children: runsFor(b.text, 26, true), spacing })
    if (b.type === 'li') {
      return new Paragraph({ children: runsFor(b.text, 24, false), spacing, bullet: { level: 0 } })
    }
    return new Paragraph({ children: runsFor(b.text, 24, false), spacing })
  })

  const header = new Header({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: WRITABLE_WIDTH_TWIPS }],
        children: [
          new TextRun({ text: title, font: FONT_NAME, size: 20, bold: true }),
          new TextRun({ text: '\t' + AUTHOR, font: FONT_NAME, size: 20 }),
        ],
      }),
    ],
  })

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT_NAME, size: 20 })],
      }),
    ],
  })

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: MARGIN_TWIPS, bottom: MARGIN_TWIPS, left: MARGIN_TWIPS, right: MARGIN_TWIPS },
            size: { width: PAGE_WIDTH_TWIPS, height: PAGE_HEIGHT_TWIPS },
          },
        },
        headers: { default: header },
        footers: { default: footer },
        children,
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  return new Uint8Array(buffer)
}

// --- .pdf generation (pdf-lib) ------------------------------------------
//
// pdf-lib has no built-in text-flow/pagination — both are done by hand
// below (word-wrap by measured width, a running y-cursor, a new page when
// content would run past the bottom margin). Times New Roman itself isn't
// embeddable without shipping a font file; pdf-lib's built-in
// Times-Roman/Times-Bold standard fonts use the same metrics Word's Times
// New Roman does, which is why no font file is bundled here.
//
// Known simplification: unlike the .docx path, **bold** spans are not
// rendered mid-paragraph here — mixed-run wrapping needs per-run width
// tracking that isn't worth the added complexity for a first version.
// Headings render fully bold; everything else renders fully regular, with
// the ** markers stripped either way.

const PT_PER_MM = 72 / 25.4
const MARGIN_PT = 25.4 * PT_PER_MM // 72pt = 2.54cm, exactly
const PAGE_WIDTH_PT = 210 * PT_PER_MM
const PAGE_HEIGHT_PT = 297 * PT_PER_MM
const BODY_SIZE = 12
const LINE_HEIGHT = BODY_SIZE * 1.5

async function buildPdf(title: string, body: string): Promise<Uint8Array> {
  const blocks = parseBlocks(body)
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  const contentWidth = PAGE_WIDTH_PT - MARGIN_PT * 2
  const contentTop = PAGE_HEIGHT_PT - MARGIN_PT
  const contentBottom = MARGIN_PT

  const pages: PDFPage[] = []
  let page: PDFPage
  let y = 0

  function drawHeader(p: PDFPage) {
    p.drawText(title, { x: MARGIN_PT, y: PAGE_HEIGHT_PT - MARGIN_PT + 12, size: 10, font: boldFont })
    const authorWidth = font.widthOfTextAtSize(AUTHOR, 10)
    p.drawText(AUTHOR, {
      x: PAGE_WIDTH_PT - MARGIN_PT - authorWidth,
      y: PAGE_HEIGHT_PT - MARGIN_PT + 12,
      size: 10,
      font,
    })
  }

  function newPage() {
    page = pdfDoc.addPage([PAGE_WIDTH_PT, PAGE_HEIGHT_PT])
    pages.push(page)
    drawHeader(page)
    y = contentTop
  }
  newPage()

  function wrapText(text: string, f: PDFFont, size: number, maxWidth: number): string[] {
    const words = text.split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let cur = ''
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w
      if (cur && f.widthOfTextAtSize(test, size) > maxWidth) {
        lines.push(cur)
        cur = w
      } else {
        cur = test
      }
    }
    if (cur) lines.push(cur)
    return lines.length ? lines : ['']
  }

  function ensureSpace(needed: number) {
    if (y - needed < contentBottom) newPage()
  }

  function drawParagraph(rawText: string, size: number, f: PDFFont, indent: number) {
    const text = stripInlineMarks(rawText)
    const lines = wrapText(text, f, size, contentWidth - indent)
    for (const line of lines) {
      ensureSpace(LINE_HEIGHT)
      page.drawText(line, { x: MARGIN_PT + indent, y: y - size, size, font: f })
      y -= LINE_HEIGHT
    }
  }

  for (const b of blocks) {
    if (b.type === 'h1') drawParagraph(b.text, 18, boldFont, 0)
    else if (b.type === 'h2') drawParagraph(b.text, 15, boldFont, 0)
    else if (b.type === 'h3') drawParagraph(b.text, 13, boldFont, 0)
    else if (b.type === 'li') drawParagraph('•  ' + b.text, BODY_SIZE, font, 18)
    else drawParagraph(b.text, BODY_SIZE, font, 0)
  }

  // Footer page numbers, once the final page count is known — bottom of
  // the page, centred, sitting within the bottom margin band rather than
  // at the physical page edge.
  pages.forEach((p, i) => {
    const label = String(i + 1)
    const w = font.widthOfTextAtSize(label, 10)
    p.drawText(label, { x: (PAGE_WIDTH_PT - w) / 2, y: MARGIN_PT / 2, size: 10, font })
  })

  return await pdfDoc.save()
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { p, title, body, format } = (await req.json()) as {
      p?: string
      title?: string
      body?: string
      format?: string
    }

    if (!p) return json({ error: 'Missing passphrase.' }, 401)
    if (!title || !body) return json({ error: 'Missing document title or content.' }, 400)
    if (format !== 'docx' && format !== 'pdf') return json({ error: 'Unknown format.' }, 400)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: ok, error: authError } = await supabase.rpc('shed_check_passphrase', { p })
    if (authError || !ok) {
      return json({ error: 'Incorrect passphrase.' }, 401)
    }

    if (format === 'docx') {
      const bytes = await buildDocx(title, body)
      return new Response(bytes, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      })
    }

    const bytes = await buildPdf(title, body)
    return new Response(bytes, {
      headers: { ...corsHeaders, 'Content-Type': 'application/pdf' },
    })
  } catch (err) {
    console.error('shed-export-document error:', err)
    return json({ error: 'Something went wrong while formatting that document.' }, 500)
  }
})
