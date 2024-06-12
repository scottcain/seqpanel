// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { render } from "@testing-library/react";
import GenericGeneSeqPanel from "./components/GenericGeneSeqPanel";
import fetch from "node-fetch";

// @ts-expect-error
globalThis.fetch = fetch;

test("expect protein rendering", async () => {
  const { findByText } = render(
    <GenericGeneSeqPanel
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
