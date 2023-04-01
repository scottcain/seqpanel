import React, { useState, useEffect } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import { RemoteFile } from "generic-filehandle";
import NCList from "@gmod/nclist";
import { BgzipIndexedFasta } from "@gmod/indexedfasta";
import NCListFeature from "./NCListFeature";

const queryParameters = new URLSearchParams(window.location.search);
const nclistbaseurl = 'https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS287/c_elegans_PRJNA13758/';
const urltemplate = 'tracks/Curated_Genes/{refseq}/trackData.jsonz';
const fastaurl = 'https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz';
const refseq = queryParameters.get("refseq");
const start = queryParameters.get("start");
const end = queryParameters.get("end");
const gene = queryParameters.get("gene");
const transcript = queryParameters.get("transcript");
const mode = queryParameters.get("mode");

//construct an object that has feature data from nclist and seq data from fasta
//(including upstream and downstream)

async function accessStore() {
  if (!nclistbaseurl) {
    throw new Error("no nclistbaseurl specified");
  } else if (!urltemplate) {
    throw new Error("no urltemplate specified");
  } else if (!refseq) {
    throw new Error("no refseq specified");    
  } else if (!start) {
    throw new Error("no start specified");
  } else if (!end) {
    throw new Error("no end specified");
  } else if (!gene) {
    throw new Error("no gene specified");
  } else if (!transcript) {
    throw new Error("no transcript specified");
  }

  const store = new NCList({
    baseUrl: nclistbaseurl,
    urlTemplate: urltemplate,
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
  const fastaFilehandle = new RemoteFile(fastaurl);
  const faiFilehandle = new RemoteFile(fastaurl + ".fai");
  const gziFilehandle = new RemoteFile(fastaurl + ".gzi");

  const t = new BgzipIndexedFasta({
    fasta: fastaFilehandle,
    fai: faiFilehandle,
    gzi: gziFilehandle,
    chunkSizeLimit: 500000,
  });

  const seq = await t.getSequence(refseq +'', +fstart , +fend);
  const upstream = await t.getSequence(refseq + '', +fstart - 499, +fstart );
  const downstream = await t.getSequence(refseq +'', +fend, +fend + 499);

  return {
    seq: seq || "",
    upstream: upstream || "",
    downstream: downstream || "",
  };
}

async function assembleBundle() {
  const feature = await accessStore();
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
