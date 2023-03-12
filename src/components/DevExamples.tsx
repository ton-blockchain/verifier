import { Button } from "@mui/material";
import { useNavigatePreserveQuery } from "../lib/useNavigatePreserveQuery";
import { download } from "../utils/jsonUtils";
import { AppButton } from "./AppButton";

const examples = [
  {
    category: "Wallets - FIFT",
    contracts: [
      ["wallet v1r1", "EQAAQ-CfIZkUjmZ6ES9D_keK2yHz10U1ba49K0S86Whva74Z"],
      ["wallet v1r2", "EQAAVd4c_2pMb4Bp8BxumyV8jutdwJ9R-q0dBqQj7tj_W8SX"],
      ["wallet v1r3", "EQAAEgdraul87g9zvm5Lxtd9FNoebifojeyT90uG6zrWBvRh"],
      ["wallet v2r1", "EQAAC2tOLQxG4KuFcS_pb2Rta1MDdgx8wAtZnGf5bIEIMLft"],
      ["wallet v2r2", "EQAAnU-irJsuuljRAWBRUhdvFB-rvGRHbdQSWXPSQYND6MVb"],
      ["wallet v3r1", "EQAY_2_A88HD43S96hbVGbCLB21e6_k1nbaqICwS3ZCrMBaZ"],
      ["wallet v3r2", "EQALgHQ-KpmkwftbsdeZdA4DvVDCYkKvria9llb7_RMeZj_8"],
    ],
  },
  {
    category: "DNS",
    contracts: [
      ["dns-root", "Ef_lZ1T4NCb2mwkme9h2rJfESCE0W34ma9lWp7-_uY3zXDvq"],
      ["dns-collection", "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"],
      ["dns-item", "EQAGSjhQajnMSne9c9hGnKdMKmohX2-MkZuOkk7TmwQKwFOU"],
    ],
  },
  {
    category: "Jettons",
    contracts: [
      ["jetton-minter-discoverable", "EQD-LkpmPTHhPW68cNfc7B83NcfE9JyGegXzAT8LetpQSRSm"],
      ["jetton-minter", "EQBb4JNqn4Z6U6-nf0cSLnOJo2dxj1QRuGoq-y6Hod72jPbl"],
      ["jetton-wallet", "EQAhuLHxOcrBwwMHKDnCUMYefuHwJ2iTOFKHWYQlDD-dgb__"],
      ["jetton-wallet-fwd-fee", "EQDt0qeoHwip8CtuUeNsaKjK-g0rwL7zUunKAnv0NCTZDSs3"],
      ["kotecoin-minter", "EQBlU_tKISgpepeMFT9t3xTDeiVmo25dW_4vUOl6jId_BNIj"],
    ],
  },

  {
    category: "Wallets",
    contracts: [
      ["wallet-v4", "EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ"],
      ["wallet-subscription-plugin", "EQAteJqywxP0g6-6e6LX7VRKKDmZDoQv1Mhx0hdslJvAUGEy"],
      ["highload-wallet-v2", "EQBPrDVWoh-AMOk3fhgPPEDs6XkN5OC6kKP9N4-7hdAkFSmO"],
      ["highload-wallet", "EQBSXD33ezTpFxVVIB7SA5vuagUa2E8LO9ujIEGnpbyMXYHT"],
      ["lockup-wallet-universal", "0QBy4wyHHuR0jOyz7uM2BH8r5aSix7251ySvQt4OZRX9veAD"],
    ],
  },
  {
    category: "Source Verifier",
    contracts: [
      ["sources-registry", "EQD-BJSVUJviud_Qv7Ymfd3qzXdrmV525e3YDzWQoHIAiInL"],
      ["source-item", "EQAXUJjoC9RUnBgTJdpp_XXebYUbq-sibaYnZ1C6Rojesz8w"],
    ],
  },
  {
    category: "Validators/Staking",
    contracts: [
      ["single-nominator", "Ef_BLbagjGnqZEkpURP96guu7M9aICAYe5hKB_P5Ng5Gju5Y"],
      ["nominator-pool", "Ef8iu8EiNOP2MczVvHseFi-CrGO1C4v6MkSSOgVZcESNGfT7"],
    ],
  },
  {
    category: "NFTs",
    contracts: [
      ["telemint-item", "EQAwC64h_7B6YrmGlsto39tBcFWjjakGzSvV7QaMwXiMKy20"],
      ["telemint-collection", "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"],
      ["nft-item-v1", "EQCZLzCnJuXCBktkb5IiqANbgThvqo2hYXjpupdTe5yHV6oY"],
      ["sbt-item", "EQC7JOIVycOY_cQnNRVtEBk8DpEFClZM8S3TlqfuD72jvU59"],
      ["nft-single", "EQBPIJPKd1G8eJ8vIWUnkpRf-5rpRp_oqiOepv3Tf571LKbq"],
      ["nft-marketplace-v2", "EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS"],
      ["nft-item-editable", "EQC2VNMbjQ8BY8b4iXTEop7dxNgYEXPAlr6ph1I-h42LrdED"],
      ["nft-offer", "EQA6rqhL9hxd8c3c1JVYQPohQVicy8PEZibTgF60iQCSEk1c"],
      ["nft-fixprice-sale-v2", "EQBeaUJdPdO66uL-P_D7-oHClw6uYIAPxoo9CX-TE6psn6lk"],
      ["nft-fixprice-sale-v3", "EQCljxPgw_0Z0uELYyt7AoGsmtGP7ORB-A4jk-gyuNJIjsRW"],
      ["nft-collection-editable", "EQCHmW1OkT6_-_vO6zoSFW9Z2T62dhffNZkkKRpdaPTFLPdT"],
      ["nft-auction", "EQC1yTmHvpD5z4Dk_l-YnEhZclc06utSisqhthfzBGz-w0Ae"],
      ["nft-auction-v2", "EQCnTg1uvsqc1ZCSgEOl5Yk5LItktG6OOYrSQ8SnJP4FFa58"],
    ],
  },
  {
    category: "DEX",
    contracts: [["amm-minter", "EQBIzHiopIkaXdXdSZ6Sm57kZV0y_5tZjnGO4fTUsMT0lOUz"]],
  },
  {
    category: "Core",
    contracts: [
      ["elector", "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"],
      [
        "config",
        "Ef9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVbxn",
        "latest code in github does not match onchain, func0.2.0 with smart contract from commit 9bff928",
      ],
    ],
  },
  {
    category: "Bridge",
    contracts: [
      ["eth-bridge", "Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr"],
      ["eth-bridge-multisig-gov-v2", "Ef87m7_QrVM4uXAPCDM4DuF9Rj5Rwa5nHubwiQG96JmyAjQY"],
      ["eth-bridge-multisig-gov-v1", "kf8rV4RD7BD-j_C-Xsu8FBO9BOOOwISjNPbBC8tcq688Gcmk"],
      ["eth-bridge-votes-collector", "EQCuzvIOXLjH2tv35gY4tzhIvXCqZWDuK9kUhFGXKLImgxT5"],
      ["bsc-bridge-multisig-gov-v1", "kf8_gV8rpqtPl1vmYDrMzwxlGQDJ63SIKO8vDhNZHT5wwVhd"],
      ["bsc-bridge-multisig-gov-v2", "kf8OvX_5ynDgbp4iqJIvWudSEanWo0qAlOjhWHtga9u2Yo7j"],
      ["bsc-bridge-votes-collector", "EQAHI1vGuw7d4WG-CtfDrWqEPNtmUuKjKFEFeJmZaqqfWTvW"],
      ["bsc-bridge", "Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r"],
    ],
  },
  {
    category: "Other",
    contracts: [
      ["counter", "EQC-QTihJV_B4f8M2nynateMLynaRT_uwNYnnuyy87kam-G7"],
      ["tact-example", "EQA7c2RpiXxH1X52lvOxLFrVj4MukLeuCENcM86rHYcQdbha"],
    ],
  },
  {
    category: "Unverified",
    contracts: [["system", "Ef8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAU"]],
  },
];

function exportExamples() {
  const mapExample = ([name, address, comment]: any) =>
    `[https://tonverifier.live/${address}]\t\t// ${name} ${comment ?? ""}`;

  const content = ["# Verified Examples"];

  examples.forEach(({ category, contracts }) => {
    content.push(`## ${category}`);
    content.push(contracts.map(mapExample).join("\n\n"));
  });

  download(content.join("\n\n"), "examples.md", "text/markdown");
}

export function DevExamples() {
  const navigate = useNavigatePreserveQuery();

  return (
    <div
      style={{
        position: "absolute",
        padding: 20,
        background: "#000000",
        borderRadius: 20,
        height: 300,
        top: 60,
        overflow: "auto",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Button
          variant="contained"
          onClick={() => {
            exportExamples();
          }}>
          Download examples.md
        </Button>
      </div>
      <br />
      <div>
        {examples.map(({ category, contracts }) => (
          <>
            <h2>{category}</h2>
            <div
              style={{
                gap: 20,
                display: "flex",
                textAlign: "center",
                flexWrap: "wrap",
              }}>
              {contracts
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([name, address]) => (
                  <div
                    style={{
                      color: "#50a7ea",
                      cursor: "pointer",
                      border: "1px solid #50a7ea",
                      padding: "10px 20px",
                      borderRadius: 10,
                    }}
                    key={name}
                    onClick={(e) => {
                      navigate(`/${address}`);
                    }}>
                    {name}
                  </div>
                ))}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
