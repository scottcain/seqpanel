import { SequenceFeatureDetailsModel } from "@jbrowse/core/BaseFeatureWidget/SequenceFeatureDetails/model";
import { observer } from "mobx-react";

const Selector = observer(function ({
  model,
}: {
  model: SequenceFeatureDetailsModel;
}) {
  const { intronBp, upDownBp, mode, hasCDS, hasExonOrCDS } = model;

  return (
    <div>
      <select
        value={mode}
        onChange={event => {
          model.setMode(event.target.value);
        }}
      >
        {Object.entries({
          ...(hasCDS
            ? {
                cds: "CDS",
              }
            : {}),
          ...(hasCDS
            ? {
                protein: "Protein",
              }
            : {}),
          ...(hasExonOrCDS
            ? {
                cdna: "cDNA",
              }
            : {}),
          ...(hasExonOrCDS
            ? {
                gene: "Genomic w/ full introns",
              }
            : {}),
          ...(hasExonOrCDS
            ? {
                gene_updownstream: `Genomic w/ full introns +/- ${upDownBp}bp up+down stream`,
              }
            : {}),
          ...(hasExonOrCDS
            ? {
                gene_collapsed_intron: `Genomic w/ ${intronBp}bp intron`,
              }
            : {}),
          ...(hasExonOrCDS
            ? {
                gene_updownstream_collapsed_intron: `Genomic w/ ${intronBp}bp intron +/- ${upDownBp}bp up+down stream `,
              }
            : {}),
          ...(!hasExonOrCDS
            ? {
                genomic: "Genomic",
              }
            : {}),
          ...(!hasExonOrCDS
            ? {
                genomic_sequence_updownstream: `Genomic +/- ${upDownBp}bp up+down stream`,
              }
            : {}),
        }).map(([key, val]) => (
          <option key={key} value={key}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Selector;
