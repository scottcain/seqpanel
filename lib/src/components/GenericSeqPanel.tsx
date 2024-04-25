// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import { assembleBundle } from "../assembleBundle";
import { Feature } from "@jbrowse/core/util";
import copy from "copy-to-clipboard";
import { Button, Tooltip } from "reactstrap";

type Bundle = Awaited<ReturnType<typeof assembleBundle>>;

export default function GenericSeqPanel({
  nclistbaseurl,
  fastaurl,
  refseq,
  mode,
  start,
  end,
  gene,
  transcript,
  urltemplate,
}: {
  nclistbaseurl: string;
  fastaurl: string;
  refseq: string;
  mode: string;
  start: number;
  end: number;
  gene: string;
  transcript: Feature;
  urltemplate: string;
}) {
  const [result, setResult] = useState<Bundle>();
  const [error, setError] = useState<unknown>();
  const seqPanelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await assembleBundle({
          nclistbaseurl,
          urltemplate,
          fastaurl,
          gene,
          transcript,
          refseq,
        });
        setResult(res);
        //	console.log(res.sequence.seq);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, [
    refseq,
    transcript,
    gene,
    start,
    end,
    fastaurl,
    urltemplate,
    nclistbaseurl,
  ]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <p>
          <Button
            color="primary"
            className="align-baseline"
            variant="contained"
            onClick={() => {
              const ref = seqPanelRef.current;
              if (ref) {
                copy(ref.textContent || "", { format: "text/plain" });
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              }
            }}
          >
            {copied ? "Copied to clipboard!" : "Copy plain fasta"}
          </Button>
          &nbsp;
          <Button
            color="primary"
            className="align-baseline"
            id="CopyHighlightedButton"
            variant="contained"
            onClick={() => {
              const ref = seqPanelRef.current;
              if (!ref) {
                return;
              }
              copy(ref.innerHTML, { format: "text/html" });
              setCopiedHtml(true);
              setTimeout(() => setCopiedHtml(false), 1000);
            }}
          >
            {copiedHtml ? "Copied to clipboard!" : "Copy highlighted fasta"}
          </Button>
        </p>
        <Tooltip
          target="CopyHighlightedButton"
          isOpen={tooltipOpen}
          placement="right"
          toggle={() => {
            setTooltipOpen(!tooltipOpen);
          }}
        >
          {
            <span style={{ fontSize: "small" }}>
              The ‘Copy with highlights’ function retains the colors from the
              sequence panel
              <br /> but cannot be pasted into some programs like notepad that
              only expect plain text.
            </span>
          }
        </Tooltip>
        <div style={{ display: "flex" }}>
          <div className="p-2">
            <SequencePanel
              ref={seqPanelRef}
              mode={mode}
              sequence={result.sequence}
              feature={result.feature as any}
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
              &nbsp;Lowercase bases have been soft masked by NCBI Genomes to
              mark repetitive sequences.
            </p>
          </div>
        </div>
      </>
    );
  }
}
