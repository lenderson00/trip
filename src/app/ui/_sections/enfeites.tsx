import { Bunting } from "@/components/paper/bunting";
import { CoffeeStain } from "@/components/paper/coffee-stain";
import { DogEar } from "@/components/paper/dog-ear";
import { InkSplatter } from "@/components/paper/ink-splatter";
import { PaperClip } from "@/components/paper/paper-clip";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PerforatedDivider } from "@/components/paper/perforated-divider";
import { PhotoCorners } from "@/components/paper/photo-corners";
import { Polaroid } from "@/components/paper/polaroid";
import { PostageStamp } from "@/components/paper/postage-stamp";
import { PushPin } from "@/components/paper/push-pin";
import { Staple } from "@/components/paper/staple";
import { Demo, Section } from "../_showcase/shell";

export function EnfeitesSection() {
  return (
    <Section
      id="enfeites"
      kicker="a mao que monta a pagina"
      title="Enfeites"
      description="Miudezas que prendem, marcam e sujam o papel. Nenhuma usa canvas — sao SVG e CSS, entao entram em qualquer lugar sem custo."
    >
      <Demo
        name="<PhotoCorners corners />"
        note="A boca recortada faz a cantoneira parecer um bolso com a foto enfiada, nao um triangulo colado."
      >
        <PhotoCorners size={24}>
          <Polaroid
            src="/photos/tropical.jpg"
            alt="Praia com coqueiros"
            caption="sem pressa"
            width={168}
            rotate={0}
          />
        </PhotoCorners>
      </Demo>

      <Demo
        name="<PaperClip /> <PushPin /> <Staple />"
        note="Duas passadas de traco no clipe: uma escura, uma clara deslocada. E o minimo pra arame parecer metal."
      >
        <div className="flex items-center gap-7">
          <PaperClip />
          <PushPin />
          <PushPin color="var(--dusk)" size={24} rotate={14} />
          <Staple />
        </div>
      </Demo>

      <Demo
        name="<PostageStamp />"
        note="Perfuracao por radial-gradient nas quatro bordas, nao clip-path: o selo mantem sombra e o miolo continua uma caixa normal."
      >
        <div className="flex items-start gap-3">
          <PostageStamp
            src="/photos/cidade.jpg"
            alt="Skyline"
            label="correio"
            value="80c"
          />
          <PostageStamp
            src="/photos/montanha.jpg"
            alt="Montanhas"
            label="par avion"
            value="1.20"
            rotate={5}
            width={104}
          />
        </div>
      </Demo>

      <Demo
        name="<CoffeeStain />"
        note="Miolo mais claro que a borda: o liquido evapora no centro e deposita o pigmento na beirada."
      >
        <div className="relative">
          <PaperSheet variant="white" className="h-40 w-56 rounded-sm p-4">
            <p className="font-hand text-xl text-caramel">bloco de notas</p>
          </PaperSheet>
          <CoffeeStain
            seed="cafe"
            className="absolute -right-4 -top-4"
            size={96}
          />
        </div>
      </Demo>

      <Demo
        name="<InkSplatter drops />"
        note="Satelites mais raros e menores conforme se afastam — distribuicao uniforme entregaria o gerador."
      >
        <div className="flex items-center gap-4">
          <InkSplatter seed="a" size={80} />
          <InkSplatter seed="b" size={58} color="var(--dusk)" rotate={40} />
        </div>
      </Demo>

      <Demo
        name="<DogEar corner />"
        note="Folha recortada no canto MAIS o triangulo do verso: so o triangulo pareceria adesivo colado."
      >
        <DogEar corner="br" size={38} back="var(--blush)">
          <PaperSheet variant="white" className="h-40 w-52 p-4">
            <p className="font-display text-lg text-ink">Dia 04</p>
            <p className="mt-1 text-xs text-ink-soft">marcado pra depois</p>
          </PaperSheet>
        </DogEar>
      </Demo>

      <Demo
        name="<Bunting count />"
        wide
        note="Cada bandeira e girada pela tangente do barbante naquele ponto — por isso as das pontas pendem e as do meio ficam retas."
      >
        <div className="w-full max-w-xl">
          <Bunting seed="festa" count={9} />
        </div>
      </Demo>

      <Demo
        name="<PerforatedDivider />"
        wide
        note="Separa secoes sem usar regua solida, que em layout de papel sempre parece borda de card."
      >
        <div className="w-full max-w-md space-y-6">
          <PerforatedDivider label="destaque aqui" />
          <PerforatedDivider scissors={false} />
        </div>
      </Demo>
    </Section>
  );
}
