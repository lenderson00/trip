import { CollageFrame } from "@/components/paper/collage-frame";
import { PhotoFrame } from "@/components/paper/photo-frame";
import { Polaroid } from "@/components/paper/polaroid";
import { TornCircle } from "@/components/paper/torn-circle";
import { WashiTape } from "@/components/paper/washi-tape";
import { Demo, Section } from "../_showcase/shell";

export function FotoSection() {
  return (
    <Section
      id="foto"
      kicker="a colagem"
      title="Foto"
      description="Quatro formas de colar uma foto na pagina. Todas aplicam o mesmo trato de filme dessaturado."
    >
      <Demo
        name="<TornCircle ring />"
        note="Anel de papel rasgado por fora, recorte circular limpo por dentro."
      >
        <div className="flex items-center gap-3">
          <TornCircle
            src="/photos/mar.jpg"
            alt="Barco ao entardecer"
            size={140}
            seed="c1"
          />
          <TornCircle
            src="/photos/cidade.jpg"
            alt="Skyline urbano"
            size={110}
            seed="c2"
            rotate={-8}
          />
        </div>
      </Demo>

      <Demo
        name="<PhotoFrame offset />"
        note="A foto deslocada dentro da moldura e o que denuncia montagem manual."
      >
        <PhotoFrame
          src="/photos/baloes.jpg"
          alt="Baloes ao amanhecer"
          width={230}
        >
          <WashiTape
            variant="airmail"
            width={90}
            height={26}
            rotate={-18}
            className="absolute -left-5 -top-3"
          />
        </PhotoFrame>
      </Demo>

      <Demo
        name="<Polaroid caption />"
        note="Aba grossa embaixo pra legenda a mao."
      >
        <Polaroid
          src="/photos/tropical.jpg"
          alt="Praia com coqueiros"
          caption="dia 3, sem pressa"
        />
      </Demo>

      <Demo
        name="<CollageFrame matColor />"
        wide
        note="O papel de tras gira ao contrario da foto: e o desencontro entre as duas rotacoes que cria a colagem. O padrao e kraft; as outras cores sao a paleta inteira."
      >
        <div className="flex flex-wrap items-center justify-center gap-6">
          <CollageFrame
            src="/photos/montanha.jpg"
            alt="Montanhas ao longe"
            width={190}
            seed="cf1"
          />
          <CollageFrame
            src="/photos/rua.jpg"
            alt="Fachadas coloniais"
            width={190}
            matColor="var(--sage)"
            rotate={-2}
            seed="cf2"
          />
          <CollageFrame
            src="/photos/mar.jpg"
            alt="Barco ancorado"
            width={190}
            matColor="var(--mustard)"
            rotate={3.5}
            seed="cf3"
          />
          <CollageFrame
            src="/photos/cidade.jpg"
            alt="Skyline urbano"
            width={190}
            matColor="var(--dusk)"
            rotate={-3}
            seed="cf4"
          />
        </div>
      </Demo>
    </Section>
  );
}
