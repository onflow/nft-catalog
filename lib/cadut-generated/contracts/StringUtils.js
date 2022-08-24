/** pragma type contract **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  deployContract,
} from '@onflow/flow-cadut'

export const CODE = `
// Copied from https://github.com/bluesign/flow-utils/blob/dnz/cadence/contracts/StringUtils.cdc with minor adjustments

import ArrayUtils from "./ArrayUtils.cdc"

pub contract StringUtils {
   
    pub fun explode(_ s: String): [String]{
        var chars : [String] =  []
        for i in ArrayUtils.range(0, s.length){
            chars.append(s[i].toString())
        }  
        return chars
    }

    pub fun trimLeft(_ s: String): String{
        for i in ArrayUtils.range(0, s.length){
            if s[i] != " "{
                return s.slice(from: i, upTo: s.length)
            }
        }
        return ""
    }

    pub fun trim(_ s: String): String{
        return self.trimLeft(s)
    }

    pub fun replaceAll(_ s: String, _ search: String, _ replace: String): String{
        return self.join(self.split(s, search), replace)
    }

    pub fun hasPrefix(_ s: String, _ prefix: String) : Bool{
        return s.length >= prefix.length && s.slice(from:0, upTo: prefix.length)==prefix
    }

    pub fun hasSuffix(_ s: String, _ suffix: String) : Bool{
        return s.length >= suffix.length && s.slice(from:s.length-suffix.length, upTo: s.length)==suffix
    }

    pub fun index(_ s : String, _ substr : String, _ startIndex: Int): Int?{
        for i in ArrayUtils.range(startIndex,s.length-substr.length+1){
            if s[i]==substr[0] && s.slice(from:i, upTo:i+substr.length) == substr{
                return i
            }
        }
        return nil
    }

    pub fun count(_ s: String, _ substr: String): Int{
        var pos = [self.index(s, substr, 0)]
        while pos[0]!=nil {
            pos.insert(at:0, self.index(s, substr, pos[0]!+pos.length*substr.length+1))
        }
        return pos.length-1
    }

    pub fun contains(_ s: String, _ substr: String): Bool {
        if let index =  self.index(s, substr, 0) {
            return true
        }
        return false
    }

    pub fun substringUntil(_ s: String, _ until: String, _ startIndex: Int): String{
        if let index = self.index( s, until, startIndex){
            return s.slice(from:startIndex, upTo: index)
        }
        return s.slice(from:startIndex, upTo:s.length)
    }

    pub fun split(_ s: String, _ delimiter: String): [String] {
        let segments: [String] = [] 
        var p = 0
        while p<=s.length{
            var preDelimiter = self.substringUntil(s, delimiter, p)
            segments.append(preDelimiter)
            p = p + preDelimiter.length + delimiter.length 
        }
        return segments 
    }

    pub fun join(_ strs: [String], _ separator: String): String {
        var joinedStr = ""
        for s in strs {
            joinedStr = joinedStr.concat(s).concat(separator)
        }
        return joinedStr.slice(from: 0, upTo: joinedStr.length - separator.length)
    }


}
`;

/**
* Method to generate cadence code for StringUtils contract
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const StringUtilsTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `StringUtils =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Deploys StringUtils transaction to the network
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> args - list of arguments
* param Array<string> - list of signers
*/
export const  deployStringUtils = async (props) => {
  const { addressMap = {} } = props;
  const code = await StringUtilsTemplate(addressMap);
  const name = "StringUtils"

  return deployContract({ code, name, processed: true, ...props })
}