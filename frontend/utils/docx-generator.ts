import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import type { DevotionalPlan } from '~backend/devotional/types';

export async function generateDocx(devotionalPlan: DevotionalPlan) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 24, // 12pt in half-points
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 line spacing in twentieths of a point
              after: 240, // 12pt after paragraph
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'title',
          name: 'Title',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Times New Roman',
            size: 32, // 16pt
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 0,
              after: 480, // 24pt
              line: 360,
            },
          },
        },
        {
          id: 'heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Times New Roman',
            size: 28, // 14pt
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 480, // 24pt
              after: 240, // 12pt
              line: 360,
            },
          },
        },
        {
          id: 'heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Times New Roman',
            size: 26, // 13pt
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 360, // 18pt
              after: 180, // 9pt
              line: 360,
            },
          },
        },
        {
          id: 'quote',
          name: 'Quote',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Times New Roman',
            size: 24,
            italics: true,
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            indent: {
              left: 720, // 0.5 inch
              right: 720,
            },
            spacing: {
              before: 240,
              after: 240,
              line: 360,
            },
            border: {
              top: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch in twentieths of a point
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Title
          new Paragraph({
            style: 'title',
            children: [
              new TextRun({
                text: devotionalPlan.title,
              }),
            ],
          }),

          // Passage Reference
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 240,
            },
            children: [
              new TextRun({
                text: devotionalPlan.passage.reference,
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
            ],
          }),

          // Passage Text (if available)
          ...(devotionalPlan.passage.text ? [
            new Paragraph({
              style: 'quote',
              children: [
                new TextRun({
                  text: `"${devotionalPlan.passage.text}"`,
                }),
              ],
            }),
          ] : []),

          // Section divider
          new Paragraph({
            children: [
              new TextRun({
                text: '═'.repeat(60),
                font: 'Times New Roman',
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 480,
              after: 480,
            },
          }),

          // 1. Meditation Section
          new Paragraph({
            style: 'heading1',
            children: [
              new TextRun({
                text: '1. MEDITAÇÃO',
              }),
            ],
          }),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Preparação para o Silêncio',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: devotionalPlan.meditation.preparation,
              }),
            ],
          }),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Leitura Contemplativa (Lectio Divina)',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: devotionalPlan.meditation.lectio,
              }),
            ],
          }),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Perguntas para Reflexão',
              }),
            ],
          }),

          ...devotionalPlan.meditation.reflection.map(question => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${question}`,
                }),
              ],
              indent: {
                left: 360, // 0.25 inch
              },
            })
          ),

          // Section divider
          new Paragraph({
            children: [
              new TextRun({
                text: '═'.repeat(60),
                font: 'Times New Roman',
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 480,
              after: 480,
            },
          }),

          // 2. Prayer Section
          new Paragraph({
            style: 'heading1',
            children: [
              new TextRun({
                text: '2. ORAÇÃO',
              }),
            ],
          }),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Oração Pessoal',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: devotionalPlan.prayer.personal,
              }),
            ],
          }),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Prática de Intercessão',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: devotionalPlan.prayer.intercession,
              }),
            ],
          }),

          // Section divider
          new Paragraph({
            children: [
              new TextRun({
                text: '═'.repeat(60),
                font: 'Times New Roman',
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 480,
              after: 480,
            },
          }),

          // 3. Study Section
          new Paragraph({
            style: 'heading1',
            children: [
              new TextRun({
                text: '3. ESTUDO',
              }),
            ],
          }),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Insight Central',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: devotionalPlan.study.insight,
              }),
            ],
          }),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Referências Cruzadas',
              }),
            ],
          }),

          ...devotionalPlan.study.crossReferences.map(ref => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${ref}`,
                }),
              ],
              indent: {
                left: 360,
              },
            })
          ),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Perguntas de Aplicação',
              }),
            ],
          }),

          ...devotionalPlan.study.applicationQuestions.map(question => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${question}`,
                }),
              ],
              indent: {
                left: 360,
              },
            })
          ),

          // Section divider
          new Paragraph({
            children: [
              new TextRun({
                text: '═'.repeat(60),
                font: 'Times New Roman',
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 480,
              after: 480,
            },
          }),

          // 4. Worship Section
          new Paragraph({
            style: 'heading1',
            children: [
              new TextRun({
                text: '4. ADORAÇÃO',
              }),
            ],
          }),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Chamado à Adoração',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: devotionalPlan.worship.call,
              }),
            ],
          }),

          new Paragraph({
            style: 'heading2',
            children: [
              new TextRun({
                text: 'Ato de Celebração e Envio',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: devotionalPlan.worship.celebration,
              }),
            ],
          }),

          // Final divider
          new Paragraph({
            children: [
              new TextRun({
                text: '═'.repeat(60),
                font: 'Times New Roman',
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 480,
              after: 480,
            },
          }),

          // Disclaimer
          new Paragraph({
            children: [
              new TextRun({
                text: '⚠️ Este conteúdo foi gerado com base em princípios bíblicos amplamente reconhecidos, mas pode refletir perspectivas diferentes entre as denominações evangélicas. Sempre consulte a sua liderança espiritual e a comunidade de fé para aprofundar o discernimento sobre o tema.',
                font: 'Times New Roman',
                size: 20,
                italics: true,
              }),
            ],
            spacing: {
              before: 240,
            },
          }),
        ],
      },
    ],
  });

  // Generate and download the document
  const blob = await Packer.toBlob(doc);
  const fileName = `${devotionalPlan.passage.reference.replace(/[^\w\s]/gi, '_')}_devocional.docx`;
  saveAs(blob, fileName);
}
