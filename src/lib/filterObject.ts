// implement filter method like arrays but for object using filter and reduce
// Language: typescript

const filterObject = (obj, filterFn) => {
	return Object.keys(obj).reduce((acc, key) => {
		if (filterFn(obj[key], key)) {
			acc[key] = obj[key];
		}
		return acc;
	}, {});
};

export default filterObject;
