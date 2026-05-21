class MathLibrary {
    static formatNumber(integerNumber) {
        if (integerNumber < 1_000_000) {
            return MathLibrary.separateThousands(integerNumber);
        } else {
            return MathLibrary.describeBigNumber(integerNumber);
        }
    }

    /**
     * For 1234567890 returns 1 234 567 890.
     */
    static separateThousands(integerNumber) {
        let ret = "";
        let subn = [];
        let rest = integerNumber.toString();
        while (rest.length > 3) {
            subn.push(" " + rest.slice(-3));
            rest = rest.substr(0, rest.length - 3);
        }
        ret = rest;
        for (var i = subn.length - 1; i >= 0; i--) {
            ret += subn[i];
        }
        return ret;
    }

    /**
     * For 1234567890 returns 1,234mld.
     * Describe numbers over 999 999.
     */
    static describeBigNumber(integerNumber) {
        let divisor;
        let suffix;

        if (integerNumber < 1_000_000_000) {
            divisor = 1_000_000;
            suffix = "mln";
        } else if (integerNumber < 1_000_000_000_000) {
            divisor = 1_000_000_000;
            suffix = "mld";
        } else {
            divisor = 1_000_000_000_000;
            suffix = "bln";
        }

        const value = Math.floor((integerNumber / divisor) * 1000) / 1000;
        return value.toFixed(3).replace(".", ",") + suffix;
    }
}
