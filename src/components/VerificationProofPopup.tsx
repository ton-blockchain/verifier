import { AppPopup } from "./AppPopup";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import { githubLink } from "../const";

function ProofTable() {
  const {
    data: contractProofData,
    isLoading: isLoadingProof,
    error: errorProof,
  } = useLoadContractProof();
  const {
    data: verifierRegistryInfo,
    isLoading: isLoadingVerifierRegistry,
    error: errorVerifierRegistry,
  } = useLoadVerifierRegistryInfo();
  // contractProofData?.verificationDate

  // TODO this supports a single verifier Id for now.
  // when we wish to support multiple verifiers, load contract proof would have to address that
  const verifierConfig = verifierRegistryInfo?.find(
    (v) => v.name === import.meta.env.VITE_VERIFIER_ID,
  );

  return (
    <div>
      {contractProofData && verifierConfig && (
        <div>
          {Object.entries(verifierConfig.pubKeyEndpoints).map(([pubKey, endpoint]) => {
            return (
              <div key={pubKey}>
                <div>
                  [VERIFIED] Public Key: {pubKey}; IP {endpoint}; Verification Date{" "}
                  {contractProofData?.verificationDate?.toDateString()} Verifier{" "}
                  <a href={verifierConfig.url}>{verifierConfig.name}</a>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {(isLoadingProof || isLoadingVerifierRegistry) && "SKELETON"}
      {(!!errorProof || !!errorVerifierRegistry) &&
        `${errorProof} ${errorVerifierRegistry} (App notification)`}
    </div>
  );
}

function ManualProof() {
  const { data: contractProofData, isLoading } = useLoadContractProof();
  // All other data here is static
  return (
    <div>
      {contractProofData && (
        <div>
          <div>download from {contractProofData.ipfsHttpLink} </div>
          <div>docker image link {githubLink} </div>
        </div>
      )}
      {isLoading && "SKELETON"}
    </div>
  );
}

export function VerificationProofPopup() {
  return (
    <>
      <AppPopup open={true} maxWidth={1140} hideCloseButton paddingTop>
        <ProofTable />
        <br />
        <ManualProof />
      </AppPopup>
    </>
  );
}
