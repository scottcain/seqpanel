import { useState, useEffect } from "react";
import GenericSeqPanel from "./GenericSeqPanel";
import transcriptList from "../fetchTranscripts";
import { Feature } from "@jbrowse/core/util";
import { SequenceFeatureDetailsF } from "@jbrowse/core/BaseFeatureWidget/SequenceFeatureDetails/model";
import Selector from "./Selector";
import { observer } from "mobx-react";
import { types } from "mobx-state-tree";

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
  const [transcript, setTranscript] = useState<Feature>();
  const feature = transcript ?? result?.[0];
  const [{ sequenceFeatureDetails }] = useState(() =>
    Model.create({
      sequenceFeatureDetails: {},
    }),
  );
  const { mode } = sequenceFeatureDetails;
  console.log({ mode, feature });

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
  useEffect(() => {
    console.log({ feature });
    if (feature) {
      // @ts-expect-error
      sequenceFeatureDetails.setFeature(feature);
    }
  }, [feature]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="GenericGeneSeqPanel">
        <Selector model={sequenceFeatureDetails} />

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
            model={sequenceFeatureDetails}
          />
        ) : null}
      </div>
    );
  }
});

export default GenericGeneSeqPanel;
