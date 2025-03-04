import { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequenceFeatureDetails/SequencePanel";
import { assembleBundle } from "../assembleBundle";
import { SimpleFeature } from "@jbrowse/core/util";
import copy from "copy-to-clipboard";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { SequenceFeatureDetailsModel } from "@jbrowse/core/BaseFeatureWidget/SequenceFeatureDetails/model";

type Bundle = Awaited<ReturnType<typeof assembleBundle>>;

const GenericSeqPanel = observer(function ({
  fastaurl,
  refseq,
  model,
}: {
  fastaurl: string;
  refseq: string;
  model: SequenceFeatureDetailsModel;
}) {
  const [result, setResult] = useState<Bundle>();
  const [error, setError] = useState<unknown>();
  const seqPanelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const { feature, intronBp, upDownBp } = model;

  const copyHighlightedTooltip = (props: any) => (  // eslint-disable-line @typescript-eslint/no-explicit-any
    <Tooltip id="copyHightlightedTooltip" {...props}>
      <span style={{ fontSize: "small" }}>
        The ‘Copy with highlights’ function retains the colors from the
        sequence panel
        <br /> but cannot be pasted into some programs like notepad that
        only expect plain text.
      </span>
    </Tooltip>
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        setError(undefined);
        if (feature) {
          const res = await assembleBundle({
            fastaurl,
            transcript: new SimpleFeature(feature),
            upDownBp,
            refseq,
          });
          setResult(res);
        }
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, [intronBp, fastaurl, refseq, upDownBp, feature]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <p>
          <Button
            variant="primary"
            className="align-baseline"
            onClick={() => {
              const ref = seqPanelRef.current;
              if (ref) {
                copy(ref.textContent ?? "", { format: "text/plain" });
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 1000);
              }
            }}
          >
            {copied ? "Copied to clipboard!" : "Copy plain fasta"}
          </Button>
          &nbsp;
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 250 }}
            overlay={copyHighlightedTooltip}
          >
            <Button
              variant="primary"
              className="align-baseline"
              id="CopyHighlightedButton"
              onClick={() => {
                const ref = seqPanelRef.current;
                if (!ref) {
                  return;
                }
                copy(ref.innerHTML, { format: "text/html" });
                setCopiedHtml(true);
                setTimeout(() => {
                  setCopiedHtml(false);
                }, 1000);
              }}
            >
              {copiedHtml ? "Copied to clipboard!" : "Copy highlighted fasta"}
            </Button>
          </OverlayTrigger>
        </p>
        <div style={{ display: "flex" }}>
          <div className="p-2">
            <SequencePanel
              ref={seqPanelRef}
              model={model}
              sequence={result.sequence}
              feature={result.feature}
            />
          </div>
          <div className="p-2">
            <p>&nbsp;Legend:</p>
            <ul>
              <li>
                <span style={{ background: "rgb(250, 200, 200)" }}>
                  Up/downstream
                </span>
              </li>
              <li>
                <span style={{ background: "rgb(200, 240, 240)" }}>UTR</span>
              </li>
              <li>
                <span style={{ background: "rgb(220, 220, 180)" }}>Coding</span>
              </li>
              <li>Intron</li>
              <li>
                <span style={{ background: "rgb(200, 255, 200)" }}>
                  Genomic (i.e., unprocessed)
                </span>
              </li>
              <li>
                <span style={{ background: "rgb(220, 160, 220)" }}>
                  Amino acid
                </span>
              </li>
            </ul>
            <p>
              &nbsp;<b>IMPORTANT NOTE</b>: Transcript and protein sequences here
              are derived from GFF coordinate mapping to the reference assembly.
              It is possible that this sequence differs from the transcript or
              amino acid sequence reported in NCBI RefSeq when the transcript or
              protein has its own NCBI RefSeq entry that differs from the genome
              assembly.
            </p>
            <p style={{ fontSize: "small" }}>
              &nbsp;Upper case bases for noncoding transcripts indicate mature
              transcript sequence (i.e., spliced exons when applicable) and for
              coding transcripts indicate mature transcript&apos;s coding region
              (i.e., CDS).
            </p>
          </div>
        </div>
      </>
    );
  }
});

export default GenericSeqPanel;
