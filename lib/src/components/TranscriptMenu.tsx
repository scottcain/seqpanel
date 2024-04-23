// eslint-disable-next-line @ypescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import transcriptList from "../fetchTranscripts";
import { Feature } from "@jbrowse/core/util";

export default function TrascriptMenu(props: {
  nclistbaseurl: string;
  refseq: string;
  start: number;
  end: number;
  gene: string;
  urltemplate: string;
} ) {
  const { nclistbaseurl, refseq, start, end, gene, urltemplate } =
    props;
  const [error, setError] = useState<unknown>();
  const [transcript, setTranscript] = useState<Feature>();
  const [transcriptArray, setTranscriptArray] = useState<Feature[]>();
  //const [transcript, setTranscript] = useState();
  //const [transcriptArray, setTranscriptArray] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await transcriptList({
          nclistbaseurl,
          refseq,
          start,
          end,
          gene,
          urltemplate
        });
        setTranscriptArray(res);
        setTranscript(res[0]);  //set the initial selection to the first item in the list
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, [nclistbaseurl, refseq, start, end, gene, urltemplate]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!transcriptArray) {
    return <div>Loading...</div>;
  } else {
    return (
       <TranscriptMenu2
           selection={transcript}
           options={transcriptArray}
           onChange={transcript => setTranscript(transcript)}
       />
    );
  }
}

function TranscriptMenu2(props: {selection: any; options: any } ) {

    const [transcript, setTranscript] = useState(props.selection);    

    return (
      <div className="TranscriptMenu">
        Transcript:
        <select
  	  onChange={event => setTranscript(event.target.value)}
        >
      {props.options.map(o => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
        </select>
      </div>
    );

}
