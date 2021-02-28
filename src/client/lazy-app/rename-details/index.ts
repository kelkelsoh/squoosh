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
