#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

bool isAnagram(const string& str1, const string& str2) {
    // 문자열에서 알파벳만 남기고 모두 소문자로 변환
    auto cleanString = [](string str) {
        str.erase(remove_if(str.begin(), str.end(), [](char ch) { return !isalpha(ch); }), str.end());
        transform(str.begin(), str.end(), str.begin(), ::tolower);
        return str;
    };

    // 문자열 정리
    string cleanedStr1 = cleanString(str1);
    string cleanedStr2 = cleanString(str2);

    // 정렬 후 비교
    sort(cleanedStr1.begin(), cleanedStr1.end());
    sort(cleanedStr2.begin(), cleanedStr2.end());

    return cleanedStr1 == cleanedStr2;
}

int main() {
    string str1, str2;

    cout << "Enter two strings:\n";
    getline(cin, str1);
    getline(cin, str2);

    if (isAnagram(str1, str2)) {
        cout << "They are anagrams!\n";
    } else {
        cout << "They are not anagrams.\n";
    }

    return 0;
}
