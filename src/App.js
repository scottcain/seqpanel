import React, { useState, useEffect } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import { RemoteFile } from "generic-filehandle";
import NCList from "@gmod/nclist";
import { BgzipIndexedFasta } from "@gmod/indexedfasta";

const queryParameters = new URLSearchParams(window.location.search)
  const assembly = queryParameters.get("assembly")
  const release  = queryParameters.get("release")
  const refseq   = queryParameters.get("refseq")
  const start    = queryParameters.get("start")
  const end      = queryParameters.get("end")
  const gene     = queryParameters.get("gene")
  const transcript = queryParameters.get("transcript")

//construct an object that has feature data from nclist and seq data from fasta (including upstream and downstream)

async function accessStore() {
  const store = new NCList({
    baseUrl:
      "https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS"+release+"/"+assembly+"/",
    urlTemplate: "tracks/Curated_Genes/{refseq}/trackData.jsonz",
    readFile: (url) => new RemoteFile(url).readFile(),
  });

  for await (const feature of store.getFeatures({
    refName: refseq,
    start: start,
    end: end,
  })) {
    var save = ''
    if (feature.get("name") === gene) {
      const children = feature.get("subfeatures");
      children.forEach(function looker(value, index, array) {
          if (value.get('name') === transcript){
              save = value;
          }
      })
    }
    return save;
  }
}

async function accessFasta() {

  const t = new BgzipIndexedFasta({
    filehandle: new RemoteFile('https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS278.genomic.fa.gz'),
    faiFilehandle: new RemoteFile('https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS278.genomic.fa.gz.fai'),
    gziFilehandle: new RemoteFile('https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS278.genomic.fa.gz.gzi'),
    chunkSizeLimit: 500000
  })

  const seq = await t.getSequence(refseq, start-1, end);
  const downstream = await t.getSequence(refseq, start-501, start-1);
  const upstream   = await t.getSequence(refseq, end, end+501);

  const sequence = {
      seq: seq,
      upstream: upstream,
      downstream: downstream
  };

  return sequence;
}

async function assembleBundle() {
    const feature = await accessStore();
    const sequence= await accessFasta();

    const object = {
        feature: feature,
        sequence: sequence
    }

    return object;  
}

export default function App() {
  const [result, setResult] = useState();
  const [error, setError] = useState();

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
    console.log(result)
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
