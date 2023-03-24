import React, { useState, useEffect } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import { RemoteFile } from "generic-filehandle";
import NCList from "@gmod/nclist";
import { BgzipIndexedFasta } from "@gmod/indexedfasta";

const queryParameters = new URLSearchParams(window.location.search);
const assembly = queryParameters.get("assembly");
const release = queryParameters.get("release");
const refseq = queryParameters.get("refseq");
const start = queryParameters.get("start");
const end = queryParameters.get("end");
const gene = queryParameters.get("gene");
const transcript = queryParameters.get("transcript");

//construct an object that has feature data from nclist and seq data from fasta (including upstream and downstream)

async function accessStore() {
  const store = new NCList({
    baseUrl:
      "https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS" +
      release +
      "/" +
      assembly +
      "/",
    urlTemplate: "tracks/Curated_Genes/{refseq}/trackData.jsonz",
    readFile: (url: string) => new RemoteFile(url).readFile(),
  });

  for await (const feature of store.getFeatures({
    refName: refseq,
    start: start,
    end: end,
  })) {
    var save = "";
    //keep only the transcript we're looking for
    if (feature.get("name") === gene) {
      return feature
        .get("subfeatures")
        .find((value: any) => value.get("name") === transcript);
    }
    return save;
  }
}

async function accessFasta() {
  if (!assembly) {
    throw new Error("no assembly specified");
  } else if (!refseq) {
    throw new Error("no refseq specified");
  } else if (!start) {
    throw new Error("no start coord specified");
  } else if (!end) {
    throw new Error("no end coord specified");
  }
  const fastaAssembly = assembly.replace("_P", ".P");

  const fastaFile =
    "https://s3.amazonaws.com/wormbase-modencode/fasta/current/" +
    fastaAssembly +
    ".WS284.genomic.fa.gz";
  console.log(fastaFile);

  const fastaFilehandle = new RemoteFile(fastaFile);
  const faiFilehandle = new RemoteFile(fastaFile + ".fai");
  const gziFilehandle = new RemoteFile(fastaFile + ".gzi");
  console.log(fastaFilehandle);
  console.log(faiFilehandle);
  console.log(gziFilehandle);

  const t = new BgzipIndexedFasta({
    fasta: fastaFilehandle,
    fai: faiFilehandle,
    gzi: gziFilehandle,
    chunkSizeLimit: 500000,
  });

  console.log(t);

  const seq = await t.getSequence(refseq, +start - 1, +end);
  const downstream = await t.getSequence(refseq, +start - 501, +start - 1);
  const upstream = await t.getSequence(refseq, +end, +end + 501);

  const sequence = {
    seq: seq,
    upstream: upstream,
    downstream: downstream,
  };

  return sequence;
}

async function assembleBundle() {
  const feature = await accessStore();
  const sequence = await accessFasta();

  const object = {
    feature: feature,
    sequence: sequence,
  };

  return object;
}

export default function App() {
  const [result, setResult] = useState<any>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        const stuff = await assembleBundle();
        setResult(stuff);
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
    console.log(result);
    return (
      <div className="App">
        <SequencePanel
          mode={"gene_updownstream_collapsed_intron"}
          sequence={result.sequence}
          feature={result.feature}
        />
      </div>
    );
  }
}
