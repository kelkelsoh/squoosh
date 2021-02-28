//This is to keep track of all available options for dropdown

export const BannerTypeOptions = [{ type: '', options: '' }];

export const PastorsOptions = [{ type: '', options: '' }];

export const ContentTypeOptions = [{ type: '', options: '' }];

export const VersionOptions = [{ type: '', options: '' }];

const fetchItems = async () => {
  const response = await fetch(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOVHSosglSDVDDPLXarBRR77GtETaJywo9Vu4iC59heFlFhSgjM6M7s-Eh2WWASZNZ04FkFXvZusvN/pub?gid=1835521144&single=true&output=csv',
  );
  const textData = await response.text();
  let data = textData.split('\n');

  for (var i = 0; i < data.length; i++) {
    let category = data[i].split(',')[0];
    let keyword = data[i].split(',')[1];
    let detailed = data[i].split(',')[2];

    if (category == 'Banner') {
      BannerTypeOptions.push({ type: keyword, options: detailed });
    } else if (category == 'Pastors') {
      PastorsOptions.push({ type: keyword, options: detailed });
    } else if (category == 'Type') {
      ContentTypeOptions.push({ type: keyword, options: detailed });
    } else if (category == 'Version') {
      VersionOptions.push({ type: keyword, options: detailed });
    }
  }
};

fetchItems();

// export const BannerTypeOptions = [
//   { type: "", options: "" },
//   { type: "AC", options: "Altar Call" },
//   { type: "C", options:  "Contextual"},
//   { type: "R", options:  "Resources"}
// ];

// export const PastorsOptions = [
//    { type: "", options: "" },
//    { type: "SPH", options: "Senior Pastor How" },
//    { type: "SPL", options:  "Senior Pastor Lia"},
//    { type: "PC", options:  "Pastor Charleston"},
//    { type: "PG", options: "Pastor Garrett" },
//    { type: "PL", options:  "Pastor Lynette"},
//    { type: "GP", options:  "Guest Pastor"},
// ];

// export const ContentTypeOptions = [
//     { type: "", options: "" },
//     { type: "A", options: "Article" },
//     { type: "AE", options: "Academic Excellence" },
//     { type: "BRP", options: "Bible Reading Plan" },
//     { type: "Co", options: "Community" },
//     { type: "Gi", options: "Give" },
//     { type: "Gl", options: "Global" },
//     { type: "HCS", options: "Heart Community Services" },
//     { type: "HS", options: "HOGC Stories" },
//     { type: "J316", options: "John 3:16 App" },
//     { type: "L", options: "Lifestyle" },
//     { type: "LS", options: "Life Stories" },
//     { type: "Mi", options: "Missions" },
//     { type: "Mu", options: "Music" },
//     { type: "N", options: "News" },
//     { type: "S", options: "Sermon" },
//     { type: "SOF", options: "Scholarship & Opportunity Fund" },
//     { type: "V", options: "Visuals" },
//     { type: "Y", options: "Youth" },
//     { type: "ZW", options: "中文" },
// ];

// export const VersionOptions = [
//     { type: "", options: "" },
//     { type: "V1", options: "V1" },
//     { type: "V2", options: "V2" },
//     { type: "V3", options: "V3" },
//     { type: "V4", options: "V4" },
//     { type: "V5", options: "V5" },
//     { type: "V6", options: "V6" },
//     { type: "V7", options: "V7" },
//     { type: "V8", options: "V8" },
//     { type: "V9", options: "V9" },
//     { type: "V10", options: "V10" },
// ];
