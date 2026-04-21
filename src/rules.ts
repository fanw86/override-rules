import { baseRules } from "./constants";
import type { CustomRule } from "./types";

export function buildRules({
    quicEnabled,
    customRules,
}: {
    quicEnabled: boolean;
    customRules: CustomRule[];
}): string[] {
    const ruleList = [...baseRules];
    if (!quicEnabled) {
        ruleList.unshift("AND,((DST-PORT,443),(NETWORK,UDP)),REJECT");
    }
    if (customRules.length > 0) {
        const geositeIndex = ruleList.findIndex((r) => r.startsWith("GEOSITE,"));
        const insertIndex = geositeIndex !== -1 ? geositeIndex : ruleList.length - 1;
        const customRuleStrings = customRules.map((r) => `DOMAIN-SUFFIX,${r.domain},${r.group}`);
        ruleList.splice(insertIndex, 0, ...customRuleStrings);
    }
    return ruleList;
}
