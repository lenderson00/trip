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
      <div className="mx-auto mb-10 max-w-xl">
        <Bunting seed="orlando" count={9} sag={22} />
      </div>

      <div className="mx-auto flex max-w-4xl flex-wrap items-start justify-center gap-8 sm:gap-10">
        <CollageFrame
          src="/photos/foguete.jpg"
          alt="Lancamento de foguete na Florida"
          width={240}
          ratio={1.45}
          seed="cf1"
          rotate={-2}
        />
        <CollageFrame
          src="/photos/castelo-disney.jpg"
          alt="Castelo da Cinderela no Magic Kingdom"
          width={220}
          ratio={1.25}
          matColor="var(--sage)"
          rotate={2.2}
          seed="cf2"
        />

        <div className="relative flex flex-col items-center gap-3 pt-2">
          <Staple className="absolute -top-3 left-1/2 z-10 -translate-x-1/2" />
          <PostageStamp
            src="/photos/hogwarts.jpg"
            alt="Castelo de Hogwarts a noite"
            label="par avion"
            value="80c"
            width={128}
            rotate={-3}
          />
          <PostageStamp
            src="/photos/piscina.jpg"
            alt="Piscina com palmeira na Florida"
            label="florida"
            value="1.20"
            width={128}
            rotate={4}
          />
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-10">
        <PostcardFlip
          src="/photos/fireworks.jpg"
          alt="Fogos no ceu de Orlando"
          place="Orlando"
          to="pra vovo"
          message="fogos no castelo, Hogwarts a noite e um foguete de verdade. o album ainda esta incompleto."
          width={320}
        />

        <div className="relative">
          <CollageFrame
            src="/photos/pool-florida.jpg"
            alt="Piscina tropical na Florida"
            width={200}
            ratio={1.1}
            matColor="var(--blush)"
            rotate={-3}
            seed="cf3"
          />
          <RansomHeadline
            seed="ferias"
            size={36}
            className="absolute -bottom-4 -right-6 rotate-[-6deg]"
          >
            FERIAS
          </RansomHeadline>
          <InkSplatter
            seed="resp"
            size={70}
            color="var(--terracotta)"
            className="absolute -bottom-10 -left-8 opacity-70"
          />
        </div>
      </div>
    </Secao>
  );
}
