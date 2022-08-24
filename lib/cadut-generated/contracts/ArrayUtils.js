/** pragma type contract **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  deployContract,
} from '@onflow/flow-cadut'

export const CODE = `
// Copied from https://github.com/bluesign/flow-utils/blob/dnz/cadence/contracts/ArrayUtils.cdc with minor adjustments

pub contract ArrayUtils {

    pub fun rangeFunc(_ start: Int, _ end: Int, _ f : ((Int):Void) ) {
        var current = start
        while current < end{
            f(current)
            current = current + 1
        }
    }

    pub fun range(_ start: Int, _ end: Int): [Int]{
        var res:[Int] = []
        self.rangeFunc(start, end, fun (i:Int){
            res.append(i)
        })
        return res
    }

    pub fun transform(_ array: &[AnyStruct], _ f : ((AnyStruct): AnyStruct)){
        for i in self.range(0, array.length){
            array[i] = f(array[i])
        }
    }

    pub fun iterate(_ array: [AnyStruct], _ f : ((AnyStruct): Bool)){
        for item in array{
            if !f(item){
                break
            }
        }
    }

    pub fun map(_ array: [AnyStruct], _ f : ((AnyStruct): AnyStruct)) : [AnyStruct] {
        var res : [AnyStruct] = []
        for item in array{
            res.append(f(item))
        }
        return res
    }

    pub fun mapStrings(_ array: [String], _ f: ((String) : String) ) : [String] {
        var res : [String] = []
        for item in array{
            res.append(f(item))
        }
        return res
    }

    pub fun reduce(_ array: [AnyStruct], _ initial: AnyStruct, _ f : ((AnyStruct, AnyStruct): AnyStruct)) : AnyStruct{
        var res: AnyStruct = f(initial, array[0])
        for i in self.range(1, array.length){
            res =  f(res, array[i])
        }
        return res
    }

}
`;

/**
* Method to generate cadence code for ArrayUtils contract
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const ArrayUtilsTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `ArrayUtils =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Deploys ArrayUtils transaction to the network
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> args - list of arguments
* param Array<string> - list of signers
*/
export const  deployArrayUtils = async (props) => {
  const { addressMap = {} } = props;
  const code = await ArrayUtilsTemplate(addressMap);
  const name = "ArrayUtils"

  return deployContract({ code, name, processed: true, ...props })
}