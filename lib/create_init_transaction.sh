flow -n testnet scripts execute ./cadence/scripts/gen_init_tx.cdc $1 | sed 's/Result: "//g' | sed 's/"$//g' | sed 's/\\n/\n/g' > ./cadence/transactions/GeneratedTransaction.cdc
echo "New transaction code made at ./cadence/transactions/GeneratedTransaction.cdc"
