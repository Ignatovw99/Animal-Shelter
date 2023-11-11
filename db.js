const path = require("node:path");
const fs = require("node:fs/promises");

const breedsFilePath = path.normalize(path.join(__dirname, "./data/breeds.json"));
const catsFilePath = path.normalize(path.join(__dirname, "./data/cats.json"));

module.exports.findAllBreeds = async () => {
    const breedsData = await fs.readFile(breedsFilePath, { encoding: "utf-8" });
    const breeds = JSON.parse(breedsData);
    return breeds;
};

module.exports.createBreed = async (breed) => {
    const breeds = await this.findAllBreeds();
    breeds.push(breed);
    await fs.writeFile(breedsFilePath, JSON.stringify(breeds));
};

module.exports.findAllCats = async () => {
    const catsData = await fs.readFile(catsFilePath, { encoding: "utf-8" });
    const cats = JSON.parse(catsData);
    return cats;
};

module.exports.findAllCatsByName = async (name) => {
    const cats = await this.findAllCats();
    const nameTerm = name.toLowerCase();
    const result = cats.filter(cat => cat.name.toLowerCase().includes(nameTerm));
    return result;
};

module.exports.findCatById = async (id) => {
    const cats = await this.findAllCats();
    const cat = cats.find(cat => cat.id === id);
    return cat;
};

module.exports.createCat = async (cat) => {
    const cats = await this.findAllCats();
    const id = cats.length ? cats[cats.length - 1].id + 1 : 1;
    const newCat = {
        id,
        ...cat
    };
    cats.push(newCat);
    await fs.writeFile(catsFilePath, JSON.stringify(cats));
    return newCat;;
};

module.exports.updateCat = async (id, catToUpdate) => {
    const cats = await this.findAllCats();
    catToUpdate.id = id;
    const updatedCats = [
        ...cats.filter(cat => cat.id !== id),
        catToUpdate
    ];
    updatedCats.sort((first, second) => first.id - second.id);
    await fs.writeFile(catsFilePath, JSON.stringify(updatedCats));
    return catToUpdate;
}

module.exports.deleteCatById = async (id) => {
    const allCats = await this.findAllCats();
    const cats = allCats.filter(cat => cat.id !== id);
    await fs.writeFile(catsFilePath, JSON.stringify(cats));
};
