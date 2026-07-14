/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GenericGeneSeqPanel from "./components/GenericGeneSeqPanel";

test("expect protein rendering (legacy NCList adapter)", async () => {
  const { findByText } = render(
    <GenericGeneSeqPanel
      adapterType="nclist"
      refseq="X"
      start={13201770}
      end={13216729}
      gene="WBGene00006749"
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS287/c_elegans_PRJNA13758/"
      urltemplate="tracks/Curated_Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz"
    />,
  );
  await findByText(/R12H7.1a.2/, {}, { timeout: 15000 });
}, 20000);

test("expect protein rendering (tabix-indexed GFF3 adapter, default)", async () => {
  const { findByText } = render(
    <GenericGeneSeqPanel
      refseq="chrXVI"
      start={79000}
      end={83000}
      gene="GAL4"
      gffurl="https://s3.amazonaws.com/agrjbrowse/docker/9.1.0/SGD/yeast/GFF_SGD.sorted.gff.gz"
      fastaurl="https://s3.amazonaws.com/agrjbrowse/fasta/GCF_000146045.2_R64_genomic.fna.gz"
    />,
  );
  await findByText(/YPL248C_id001/, {}, { timeout: 15000 });
}, 20000);

test("expect a very long transcript's sequence to load (DMD, ~2Mb span)", async () => {
  // DMD (dystrophin) is one of the longest human genes (~2.2Mb genomic
  // span); its canonical transcript below spans ~2.1Mb end-to-end, which
  // has previously exposed problems with long sequences failing to load.
  const { findByText, container } = render(
    <GenericGeneSeqPanel
      refseq="X"
      start={31097000}
      end={33340000}
      gene="DMD"
      gffurl="https://s3.amazonaws.com/agrjbrowse/docker/9.1.0/human/GFF_HUMAN.sorted.gff.gz"
      fastaurl="https://s3.amazonaws.com/agrjbrowse/fasta/GCF_000001405.40_GRCh38.p14_genomic.fna.gz"
    />,
  );

  await findByText("NM_004006.3", {}, { timeout: 30000 });
  const initialLength = container.textContent.length;

  const user = userEvent.setup();
  const transcriptSelect = container.querySelector("select");
  if (!transcriptSelect) {
    throw new Error("transcript select not found");
  }
  await user.selectOptions(transcriptSelect, "NM_004006.3");

  // Once the ~2.1Mb sequence for this transcript has been fetched and
  // rendered, the component's text content should have grown substantially.
  await waitFor(
    () => {
      const length = container.textContent.length;
      expect(length).toBeGreaterThan(initialLength + 1000);
    },
    { timeout: 60000 },
  );
}, 90000);
