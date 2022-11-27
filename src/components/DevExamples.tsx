import { useNavigate } from "react-router-dom";
const examples_not_verified = [["wallet-v3", "EQBuOkznvkh_STO7F8W6FcoeYhP09jjO1OeXR2RZFkN6w7NR"]];

const examples = [
  ["dns-root", "Ef_lZ1T4NCb2mwkme9h2rJfESCE0W34ma9lWp7-_uY3zXDvq"],
  ["wallet-v4", "EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ"],
  ["dns-collection", "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"],
  ["dns-item", "EQAGSjhQajnMSne9c9hGnKdMKmohX2-MkZuOkk7TmwQKwFOU"],
  ["counter", "EQC-QTihJV_B4f8M2nynateMLynaRT_uwNYnnuyy87kam-G7"],
  ["jetton-minter-discoverable", "EQD-LkpmPTHhPW68cNfc7B83NcfE9JyGegXzAT8LetpQSRSm"],
  ["jetton-minter", "EQBb4JNqn4Z6U6-nf0cSLnOJo2dxj1QRuGoq-y6Hod72jPbl"],
  ["jetton-wallet", "EQAhuLHxOcrBwwMHKDnCUMYefuHwJ2iTOFKHWYQlDD-dgb__"],
  ["single-nominator", "Ef_BLbagjGnqZEkpURP96guu7M9aICAYe5hKB_P5Ng5Gju5Y"],
  ["sources-registry", "EQD-BJSVUJviud_Qv7Ymfd3qzXdrmV525e3YDzWQoHIAiInL"],
  ["nominator-pool", "Ef8iu8EiNOP2MczVvHseFi-CrGO1C4v6MkSSOgVZcESNGfT7"],
  ["telemint-item", "EQAwC64h_7B6YrmGlsto39tBcFWjjakGzSvV7QaMwXiMKy20"],
  ["telemint-collection", "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"],
  ["nft-item-v1", "EQCZLzCnJuXCBktkb5IiqANbgThvqo2hYXjpupdTe5yHV6oY"],
  ["elector", "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"],
  ["wallet-subscription-plugin", "EQAteJqywxP0g6-6e6LX7VRKKDmZDoQv1Mhx0hdslJvAUGEy"],
  ["sbt-item", "EQC7JOIVycOY_cQnNRVtEBk8DpEFClZM8S3TlqfuD72jvU59"],
  ["nft-single", "EQBPIJPKd1G8eJ8vIWUnkpRf-5rpRp_oqiOepv3Tf571LKbq"],
  ["nft-marketplace-v2", "EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS"],
  ["nft-item-editable", "EQC2VNMbjQ8BY8b4iXTEop7dxNgYEXPAlr6ph1I-h42LrdED"],
  ["nft-offer", "EQA6rqhL9hxd8c3c1JVYQPohQVicy8PEZibTgF60iQCSEk1c"],
  ["nft-fixprice-sale-v2", "EQBeaUJdPdO66uL-P_D7-oHClw6uYIAPxoo9CX-TE6psn6lk"],
  ["nft-fixprice-sale-v3", "EQCljxPgw_0Z0uELYyt7AoGsmtGP7ORB-A4jk-gyuNJIjsRW"],
  ["nft-collection-editable", "EQCHmW1OkT6_-_vO6zoSFW9Z2T62dhffNZkkKRpdaPTFLPdT"],
  ["nft-auction", "EQC1yTmHvpD5z4Dk_l-YnEhZclc06utSisqhthfzBGz-w0Ae"],
  ["jetton-wallet-fwd-fee", "EQDt0qeoHwip8CtuUeNsaKjK-g0rwL7zUunKAnv0NCTZDSs3"],
  ["nft-auction-v2", "EQCnTg1uvsqc1ZCSgEOl5Yk5LItktG6OOYrSQ8SnJP4FFa58"],
  ["amm-minter", "EQBIzHiopIkaXdXdSZ6Sm57kZV0y_5tZjnGO4fTUsMT0lOUz"],
];

export function DevExamples() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        padding: 20,
        background: "#000000",
        borderRadius: 20,
      }}>
      <div>DEV//EXAMPLES:</div>
      <br />
      <div
        style={{
          gap: 20,
          display: "flex",
          textAlign: "center",
          flexWrap: "wrap",
        }}>
        {examples
          .sort((a, b) => a[0].localeCompare(b[0]))
          .concat(examples_not_verified)
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
    </div>
  );
}
