// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import { assembleBundle } from "../assembleBundle";
import { Feature } from "@jbrowse/core/util";
import copy from 'copy-to-clipboard'
import { Button, Tooltip } from 'reactstrap';

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
  const [copied, setCopied] = useState(false)
  const [copiedHtml, setCopiedHtml] = useState(false)
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
    return(
     <>
       <div>
        {  
        () => {const ref = seqPanelRef.current;
	console.log('is this executing?');
        if (ref && ref.textContent) {
	    console.log(ref.textContent);
            const strLen = ref.textContent.substring(ref.textContent.indexOf("\n")).length || "0";
            console.log(ref.innerText.substring(ref.textContent.indexOf("\n")));
            return "<div>length: "+strLen+ "residues</div>"; }
        else {
            return '<div>No length</div>';
	    }
	} }
	</div>
     <Button
          variant="contained"
          style={{height: '34px' }}
          onClick={() => {
            const ref = seqPanelRef.current
            if (ref) {
              copy(ref.textContent || '', { format: 'text/plain' })
              setCopied(true)
              setTimeout(() => setCopied(false), 1000)
            }
          }}
        >
          {copied ? 'Copied to clipboard!' : 'Copy plaintext'}
        </Button>
        <Button
            id="CopyHighlightedButton"
            style={{height: '34px' }}
            variant="contained"
            onClick={() => {
              const ref = seqPanelRef.current
              if (!ref) {
                return
              }
              copy(ref.innerHTML, { format: 'text/html' })
              setCopiedHtml(true)
              setTimeout(() => setCopiedHtml(false), 1000)
            }}
          >
            {copiedHtml ? 'Copied to clipboard!' : 'Copy highlighted sequence'}
        </Button>
        <Tooltip
          target="CopyHighlightedButton"
          isOpen={tooltipOpen}
          placement="right"
          toggle={() => { setTooltipOpen(!tooltipOpen) }}>
             {<span style={{ fontSize: "small" }}>The ‘Copy highlighted sequence’ function retains the colors from the sequence panel<br /> but cannot be pasted into some programs like notepad that only expect plain text.</span>}
        </Tooltip>
     {/* 
        NOTE: this is not good enough. Need to reach into the SequencePanel (hopefully via 'ref')
        to get was is actually displayed and find it's length (with linefeeds and header removed)
     <div>Sequence length: {result.sequence.seq.length} residues</div>
     */}
     <div style={ { display: 'flex' } }>
      <div className="p-2">
        <SequencePanel
          ref={seqPanelRef}
          mode={mode}
          sequence={result.sequence}
          feature={result.feature as any}
        />
      </div>
      <div className="p-2">
        <p>Legend:</p>
        <ul>
          <li><span style={{ background: 'rgb(250, 200, 200)' }}>Up/downstream</span></li>
          <li><span style={{ background: 'rgb(200, 240, 240)' }}>UTR</span></li>
          <li><span style={{ background: 'rgb(220, 220, 180)' }}>Coding</span></li>
          <li>Intron</li>
          <li><span style={{ background: 'rgb(200, 255, 200)' }}>Genomic (i.e., unprocessed)</span></li>
          <li><span style={{ background: 'rgb(220, 160, 220)' }}>Amino acid</span></li>
        </ul>
        <p style={{ fontSize: "small" }}>Note that lowercase bases generally indicate masked sequence.</p>
      </div>
     </div>
     </>
    );
  }
}
