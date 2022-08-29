if [ $# -eq 0 ]
  then
    echo "No arguments supplied, supply a collection name"
    exit 1
fi
mkdir -p generated/${1}/
flow -n testnet scripts execute ./cadence/scripts/gen_tx.cdc CollectionInitialization $1 flow | sed 's/Result: "//g' | sed 's/"$//g' | sed 's/\\\"/\"/g' | sed 's/\\n/\n/g' > ./generated/${1}/CollectionInitialization.cdc
flow -n testnet scripts execute ./cadence/scripts/gen_tx.cdc StorefrontListItem $1 flow | sed 's/Result: "//g' | sed 's/"$//g' | sed 's/\\\"/\"/g' | sed 's/\\n/\n/g' > ./generated/${1}/StorefrontListItem.cdc
flow -n testnet scripts execute ./cadence/scripts/gen_tx.cdc StorefrontBuyItem $1 flow | sed 's/Result: "//g' | sed 's/"$//g' | sed 's/\\\"/\"/g' | sed 's/\\n/\n/g' > ./generated/${1}/StorefrontBuyItem.cdc
echo "New transaction code made at cadence/transactions/generated/${1}/"
