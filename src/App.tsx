import React, { useState, useEffect } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import { RemoteFile } from "generic-filehandle";
import NCList from "@gmod/nclist";
import { BgzipIndexedFasta } from "@gmod/indexedfasta";
import NCListFeature from "./NCListFeature";

const queryParameters = new URLSearchParams(window.location.search);
const assembly = queryParameters.get("assembly");
const release = queryParameters.get("release");
const refseq = queryParameters.get("refseq");
const start = queryParameters.get("start");
const end = queryParameters.get("end");
const gene = queryParameters.get("gene");
const transcript = queryParameters.get("transcript");
const mode = queryParameters.get("mode");

//construct an object that has feature data from nclist and seq data from fasta
//(including upstream and downstream)

async function accessStore() {
  const store = new NCList({
    baseUrl: `https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS${release}/${assembly}/`,
    urlTemplate: "tracks/Curated_Genes/{refseq}/trackData.jsonz",
    readFile: (url: string) => new RemoteFile(url).readFile(),
  });

  for await (const feature of store.getFeatures({
    refName: refseq,
    start: start,
    end: end,
  })) {
    //keep only the transcript we're looking for
    if (feature.get("name") === gene) {
      return feature
        .get("subfeatures")
        .find((value: any) => value.get("name") === transcript);
    }
  }
}

async function accessFasta( fstart: number, fend: number) {
  if (!assembly) {
    throw new Error("no assembly specified");
  } else if (!refseq) {
    throw new Error("no refseq specified");
  } else if (!fstart) {
    throw new Error("no start coord specified");
  } else if (!fend) {
    throw new Error("no end coord specified");
  }
  const fastaAssembly = assembly.replace("_P", ".P");

  const fastaFile = `https://s3.amazonaws.com/wormbase-modencode/fasta/current/${fastaAssembly}.WS284.genomic.fa.gz`;

  const fastaFilehandle = new RemoteFile(fastaFile);
  const faiFilehandle = new RemoteFile(fastaFile + ".fai");
  const gziFilehandle = new RemoteFile(fastaFile + ".gzi");

  const t = new BgzipIndexedFasta({
    fasta: fastaFilehandle,
    fai: faiFilehandle,
    gzi: gziFilehandle,
    chunkSizeLimit: 500000,
  });

  const seq = await t.getSequence(refseq, +fstart - 1, +fend);
  const upstream = await t.getSequence(refseq, +fstart - 501, +fstart - 1);
  const downstream = await t.getSequence(refseq, +fend, +fend + 500);

  return {
    seq: seq || "",
    upstream: upstream || "",
    downstream: downstream || "",
  };
}

async function assembleBundle() {
  const feature = await accessStore();
  console.log(feature)
  const sequence = await accessFasta(feature[1], feature[2]);

  const f = new NCListFeature(feature);
  return {
    feature: f.toJSON(),
    sequence,
    mode: mode,
    intronBp: 10,
  };
}
type Bundle = Awaited<ReturnType<typeof assembleBundle>>;

export default function App() {
  const [result, setResult] = useState<Bundle>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        setResult(await assembleBundle());
      } catch (e) {
        setError(e);
      }
    })();
  }, []);
  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    return (
/*      Available mode options include: 
   genomic
   genomic_sequence_updown
   cds
   cdna
   protein
   gene
   gene_collapsed_intron
   gene_updownstream
   gene_updownstream_collapsed_intron 
*/
      <div className="App">
        <SequencePanel
          mode={result.mode as any}
          sequence={result.sequence}
          feature={result.feature as any}
        />
      </div>
    );
  }
}
