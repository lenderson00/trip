import { Bunting } from "@/components/paper/bunting";
import { CollageFrame } from "@/components/paper/collage-frame";
import { InkSplatter } from "@/components/paper/ink-splatter";
import { PostageStamp } from "@/components/paper/postage-stamp";
import { PostcardFlip } from "@/components/paper/postcard-flip";
import { RansomHeadline } from "@/components/paper/ransom-headline";
import { Staple } from "@/components/paper/staple";
import { Secao } from "./shell";

export function Lembrancas() {
  return (
    <Secao id="lembrancas" kicker="pra guardar" titulo="Lembrancas">
      <div className="mb-8 max-w-xl">
        <Bunting seed="orlando" count={9} sag={22} />
      </div>

      <div className="flex flex-wrap items-start gap-8">
        <CollageFrame
          src="/photos/foguete.jpg"
          alt="Foguete na plataforma de lancamento"
          width={220}
          seed="cf1"
        />
        <CollageFrame
          src="/photos/outlet.jpg"
          alt="Fachadas do outlet"
          width={200}
          matColor="var(--sage)"
          rotate={-2.5}
          seed="cf2"
        />

        <div className="relative flex flex-col items-center gap-2">
          <Staple className="absolute -top-4 left-1/2 z-10 -translate-x-1/2" />
          <PostageStamp
            src="/photos/castelo.jpg"
            alt="Castelo iluminado"
            label="par avion"
            value="80c"
            width={118}
          />
          <PostageStamp
            src="/photos/piscina.jpg"
            alt="Piscina do resort"
            label="florida"
            value="1.20"
            width={118}
            rotate={4}
          />
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-10">
        <PostcardFlip
          src="/photos/montanha-russa.jpg"
          alt="Montanha-russa contra o por do sol"
          place="Orlando"
          to="pra vovo"
          message="a gente andou na montanha-russa sete vezes seguidas. o pai passou mal na terceira e continuou mesmo assim."
          width={320}
        />

        <div className="relative">
          <RansomHeadline seed="ferias" size={40}>
            FERIAS
          </RansomHeadline>
          <InkSplatter
            seed="resp"
            size={70}
            color="var(--terracotta)"
            className="absolute -bottom-8 -right-6 opacity-70"
          />
        </div>
      </div>
    </Secao>
  );
}
