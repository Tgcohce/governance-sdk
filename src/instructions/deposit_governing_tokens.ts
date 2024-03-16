import { PublicKey } from "@solana/web3.js";
import { BN, Program } from "@coral-xyz/anchor";
import ixFilter from "../ix_filter";
import { GovernanceIdl } from "../idl/idl";
import { PdaClient } from "../pda";

export default async function _depositGoverningTokensContext(
    realmAccount: PublicKey,
    governingTokenMintAccount: PublicKey,
    governingTokenSourceAccount: PublicKey,
    governingTokenOwner: PublicKey,
    governingTokenSourceAuthority: PublicKey,
    amount: BN,
    program: Program<GovernanceIdl>,
    payer: PublicKey,
    pda: PdaClient
) {
    const governingTokenHoldingAccount = pda.governingTokenHoldingAccount({
        realmAccount, governingTokenMintAccount
    }).publicKey

    const tokenOwnerRecord = pda.tokenOwnerRecordAccount(
        {realmAccount, governingTokenMintAccount, governingTokenOwner}
    ).publicKey

    const realmConfig = pda.realmConfigAccount({realmAccount}).publicKey

    const defaultIx = await program.methods.depositGoverningTokens(amount)
    .accounts({
        realmAccount,
        governingTokenHoldingAccount,
        governingTokenOwnerAccount: governingTokenOwner,
        governingTokenSourceAccount,
        governingTokenSourceAccountAuthority: governingTokenSourceAuthority,
        realmConfigAccount: realmConfig,
        tokenOwnerRecord,
        payer
    })
    .instruction();

    return ixFilter(defaultIx, "depositGoverningTokens", program);
}