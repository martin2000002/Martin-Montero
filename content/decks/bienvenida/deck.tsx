import { Bullets, Code, Columns, defineDeck, Eyebrow, Lead, Quote, Slide, Stat, Text, Title } from '@/deck'

export default defineDeck({
  title: 'Cómo funciona este sitio',
  description: 'Guía rápida: crear una presentación, subir archivos y compartir el link.',
  date: '2026-10-26',
  theme: 'midnight',
  slides: [
    <Slide layout="cover">
      <Eyebrow>Martin Montero</Eyebrow>
      <Title size="xl">
        Presenta desde <em>un link.</em>
      </Title>
      <Lead>Nada depende de tu computadora: abre el link en cualquier pantalla y presenta.</Lead>
    </Slide>,

    <Slide>
      <Eyebrow>Dos formas de agregar contenido</Eyebrow>
      <Title size="md">Todo vive en la carpeta content/</Title>
      <Columns>
        <div>
          <Text>
            <strong>content/decks/</strong> — presentaciones programadas en React (<code>deck.tsx</code>) o
            Markdown (<code>deck.md</code>).
          </Text>
        </div>
        <div>
          <Text>
            <strong>content/files/</strong> — PDFs, PowerPoints, imágenes, videos. Los PDF se presentan diapositiva por
            diapositiva.
          </Text>
        </div>
      </Columns>
    </Slide>,

    <Slide layout="split">
      <div>
        <Eyebrow>Nueva presentación</Eyebrow>
        <Title size="md">Un comando.</Title>
        <Lead>Crea la carpeta con una plantilla lista para editar.</Lead>
      </div>
      <div>
        <Code>{`npm run new -- "Mi charla"
npm run new -- "Notas" --md
npm run dev`}</Code>
      </div>
    </Slide>,

    <Slide>
      <Eyebrow>Al presentar</Eyebrow>
      <Title size="md">Atajos de teclado</Title>
      <Bullets
        items={[
          <>
            <strong>← →</strong> o espacio para avanzar · también deslizando en el celular
          </>,
          <>
            <strong>F</strong> pantalla completa · <strong>O</strong> vista general
          </>,
          <>
            El link incluye la diapositiva: <code>/d/bienvenida#3</code>
          </>,
        ]}
      />
    </Slide>,

    <Slide layout="center">
      <Columns gap={120}>
        <Stat value="0" label="servidores que mantener" />
        <Stat value="1" label="comando para publicar" />
        <Stat value="∞" label="pantallas donde presentar" />
      </Columns>
    </Slide>,

    <Slide layout="center">
      <Quote by="npm run deploy">Escribe, publica, comparte el link.</Quote>
    </Slide>,
  ],
})
