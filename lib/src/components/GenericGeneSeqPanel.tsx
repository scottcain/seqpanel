import { useState, useEffect } from "react";
import GenericSeqPanel from "./GenericSeqPanel";
import transcriptList from "../fetchTranscripts";
import { Feature } from "@jbrowse/core/util";
import { SequenceFeatureDetailsF } from "@jbrowse/core/BaseFeatureWidget/SequenceFeatureDetails/model";
import Selector from "./Selector";
import { observer } from "mobx-react";
import { types } from "mobx-state-tree";
import NCListFeature from "../NCListFeature";

// blank parent Model to allow afterAttach autorun to execute
const Model = types.model({
  sequenceFeatureDetails: SequenceFeatureDetailsF(),
});

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
  const [{ sequenceFeatureDetails }] = useState(() => {
    const model = Model.create({
      sequenceFeatureDetails: {},
    });
    model.sequenceFeatureDetails.setUpDownBp(500);
    return model;
  });

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
        const r = res.map(r => new NCListFeature(r));
        setResult(r);
        sequenceFeatureDetails.setFeature(r[0]?.toJSON());
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, [
    sequenceFeatureDetails,
    nclistbaseurl,
    fastaurl,
    refseq,
    start,
    end,
    gene,
    urltemplate,
  ]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="GenericGeneSeqPanel">
        <div>
          Transcript:
          <select
            value={sequenceFeatureDetails.feature?.uniqueId}
            onChange={e => {
              sequenceFeatureDetails.setFeature(
                // @ts-expect-error
                result.find(r => r.id() === e.target.value)?.toJSON(),
              );
            }}
          >
            {result.map(r => (
              <option key={r.id()} value={r.id()}>
                {r.get("name")}
              </option>
            ))}
          </select>
          <Selector model={sequenceFeatureDetails} />
        </div>

        {sequenceFeatureDetails.feature ? (
          <GenericSeqPanel
            refseq={refseq}
            fastaurl={fastaurl}
            model={sequenceFeatureDetails}
          />
        ) : null}
      </div>
    );
  }
});

export default GenericGeneSeqPanel;
