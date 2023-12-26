class Library
{
    /**
     * For 1234567890 returns 1 234 567 890.
     */
    static separateThousands(integerNumber) {
        let ret = "";
        let subn = [];
        let rest = integerNumber.toString();
        while (rest.length > 3) {
            subn.push(" " + rest.slice(-3));
            rest = rest.substr(0, rest.length-3);
        }
        ret = rest;
        for (var i = subn.length-1; i >= 0; i--) {
            ret += subn[i];
        }
        return ret;
    }
}
