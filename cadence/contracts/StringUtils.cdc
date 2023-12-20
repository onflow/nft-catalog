// Copied from https://github.com/bluesign/flow-utils/blob/dnz/cadence/contracts/StringUtils.cdc with minor adjustments

import ArrayUtils from "./ArrayUtils.cdc"

access(all) contract StringUtils {
   
    access(all) fun explode(_ s: String): [String]{
        var chars : [String] =  []
        for i in ArrayUtils.range(0, s.length){
            chars.append(s[i].toString())
        }  
        return chars
    }

    access(all) fun trimLeft(_ s: String): String{
        for i in ArrayUtils.range(0, s.length){
            if s[i] != " "{
                return s.slice(from: i, upTo: s.length)
            }
        }
        return ""
    }

    access(all) fun trim(_ s: String): String{
        return self.trimLeft(s)
    }

    access(all) fun replaceAll(_ s: String, _ search: String, _ replace: String): String{
        return self.join(self.split(s, search), replace)
    }

    access(all) fun hasPrefix(_ s: String, _ prefix: String) : Bool{
        return s.length >= prefix.length && s.slice(from:0, upTo: prefix.length)==prefix
    }

    access(all) fun hasSuffix(_ s: String, _ suffix: String) : Bool{
        return s.length >= suffix.length && s.slice(from:s.length-suffix.length, upTo: s.length)==suffix
    }

    access(all) fun index(_ s : String, _ substr : String, _ startIndex: Int): Int?{
        for i in ArrayUtils.range(startIndex,s.length-substr.length+1){
            if s[i]==substr[0] && s.slice(from:i, upTo:i+substr.length) == substr{
                return i
            }
        }
        return nil
    }

    access(all) fun count(_ s: String, _ substr: String): Int{
        var pos = [self.index(s, substr, 0)]
        while pos[0]!=nil {
            pos.insert(at:0, self.index(s, substr, pos[0]!+pos.length*substr.length+1))
        }
        return pos.length-1
    }

    access(all) fun contains(_ s: String, _ substr: String): Bool {
        if let index =  self.index(s, substr, 0) {
            return true
        }
        return false
    }

    access(all) fun substringUntil(_ s: String, _ until: String, _ startIndex: Int): String{
        if let index = self.index( s, until, startIndex){
            return s.slice(from:startIndex, upTo: index)
        }
        return s.slice(from:startIndex, upTo:s.length)
    }

    access(all) fun split(_ s: String, _ delimiter: String): [String] {
        let segments: [String] = [] 
        var p = 0
        while p<=s.length{
            var preDelimiter = self.substringUntil(s, delimiter, p)
            segments.append(preDelimiter)
            p = p + preDelimiter.length + delimiter.length 
        }
        return segments 
    }

    access(all) fun join(_ strs: [String], _ separator: String): String {
        var joinedStr = ""
        for s in strs {
            joinedStr = joinedStr.concat(s).concat(separator)
        }
        return joinedStr.slice(from: 0, upTo: joinedStr.length - separator.length)
    }


}