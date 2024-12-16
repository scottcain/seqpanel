import { useState, useEffect } from "react";
import GenericSeqPanel from "./GenericSeqPanel";
import transcriptList from "../fetchTranscripts";
import { Feature } from "@jbrowse/core/util";
import { SequenceFeatureDetailsF } from "@jbrowse/core/BaseFeatureWidget/SequenceFeatureDetails/model";
import { observer } from "mobx-react";

const GenericGeneSeqPanel = observer(function ({
  nclistbaseurl,
  fastaurl,
  refseq,
  start,
  end,
  gene,
  urltemplate,
}: {
  nclistbaseurl: string;
  fastaurl: string;
  refseq: string;
  start: number;
  end: number;
  gene: string;
  urltemplate: string;
}) {
  const [result, setResult] = useState<Feature[]>();
  const [error, setError] = useState<unknown>();
  const [transcript, setTranscript] = useState<Feature>();
  const feature = transcript ?? result?.[0];
  const [model] = useState(SequenceFeatureDetailsF().create({}));

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        setError(undefined);
        const res = await transcriptList({
          nclistbaseurl,
          refseq,
          start,
          end,
          gene,
          urltemplate,
        });
        setResult(res);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, [nclistbaseurl, fastaurl, refseq, start, end, gene, urltemplate]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="GenericGeneSeqPanel">
        <p>
          Transcript:
          <select
            onChange={e => {
              setTranscript(result.find(r => r.id() === e.target.value));
            }}
          >
            {result.map(r => (
              <option key={r.id()} value={r.id()}>
                {r.get("name")}
              </option>
            ))}
          </select>
          &nbsp; Mode:
          <select
            onChange={e => {
              model.setMode(e.target.value);
            }}
          >
            <option value="gene">gene</option>
            <option value="cds">CDS</option>
            <option value="cdna">cDNA</option>
            <option value="protein">protein</option>
            <option value="genomic">genomic</option>
            <option value="genomic_sequence_updown">
              genomic +500bp up and down stream
            </option>
            <option value="gene_collapsed_intron">
              gene with collapsed introns
            </option>
            <option value="gene_updownstream">
              gene with 500bp up and down stream
            </option>
            <option value="gene_updownstream_collapsed_intron">
              gene with 500bp up and down stream and collapsed introns
            </option>
          </select>
        </p>
        {feature ? (
          <GenericSeqPanel
            refseq={refseq}
            start={start}
            end={end}
            fastaurl={fastaurl}
            gene={gene}
            urltemplate={urltemplate}
            nclistbaseurl={nclistbaseurl}
            transcript={feature}
            model={model}
          />
        ) : null}
      </div>
    );
  }
});

export default GenericGeneSeqPanel;
