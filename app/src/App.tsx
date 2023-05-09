import { FC, ReactElement, useState, useEffect } from "react";
import { GenericSeqPanel } from "generic-sequence-panel";

type UpdateSeqProps = {
  trans: string,
  mod: string,
}

const UpdateSeq: FC<UpdateSeqProps> = ( {trans, mod } ): ReactElement => { 
    useEffect(() => {
    }, [trans, mod]);

    return (
    <GenericSeqPanel
      refseq="X"
      start={13201770}
      end={13216729}
      gene="WBGene00006749"
      transcript={trans}
      mode={mod}
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS288/c_elegans_PRJNA13758/"
      urltemplate="tracks/Curated_Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz"
    />
    );
}

function App() {
  var transcript = "R12H7.1a.2";
  var mode = "gene";

  const [valueTranscript, setValueTranscript] = useState(transcript);
  const [valueMode,       setValueMode]       = useState(mode);

  return (
    <div>
    Transcript:<select onChange={(e) => {setValueTranscript(e.target.value)}}>
      <option value="R12H7.1a.1">R12H7.1a.1</option>
      <option value="R12H7.1a.2">R12H7.1a.2</option>
      <option value="R12H7.1b.1">R12H7.1b.1</option>
    </select>
    Mode:<select onChange={(e) => {setValueMode(e.target.value)}}> 
      <option value="gene">gene</option>
      <option value="cds">CDS</option>
      <option value="cdna">cDNA</option>
      <option value="protein">protein</option>
      <option value="genomic">genomic</option>
      <option value="genomic_sequence_updown">genomic +500bp up and down stream</option>
      <option value="gene_collapsed_intron">gene with colapsed introns</option>
      <option value="gene_updownstream">gene with 500bp up and down stream</option>
      <option value="gene_updownstream_collapsed_intron">gene with 500bp up and down stream and colapsed introns</option>
    </select>
    <br />
    <UpdateSeq trans={valueTranscript} mod={valueMode} />
    </div>
  );
}

export default App;
