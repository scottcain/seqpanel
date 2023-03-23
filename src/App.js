import React, { useState, useEffect } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import { RemoteFile } from "generic-filehandle";
import NCList from "@gmod/nclist";

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
    if (feature.get("name") === gene) {
      const children = feature.get("subfeatures");
      children.forEach(function looker(value, index, array) {
          console.log(value.get('name'))
          if (value.get('name') === transcript){
              console.log('returning')
              return value;
          }
      })
    }
  }
}


export default function App() {
  const [result, setResult] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    (async () => {
      try {
        const stuff = await accessStore();
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
      <ul>
        {result.map((value) => {
          return (
            <li key={value.id()}>
              {value.get("name")} {value.get("seq_id")}:
              {value.get("start")}-{value.get("end")}
            </li>
          );
        })}
      </ul>
    );
  }
}
