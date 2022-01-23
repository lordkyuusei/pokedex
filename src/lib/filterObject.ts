const filterObject = (obj: { [x: string]: any; }, filterFn: (arg0: any, arg1: string) => any) => {
	return Object.keys(obj).reduce((acc, key) => {
		if (filterFn(obj[key], key)) {
			acc[key] = obj[key];
		}
		return acc;
	}, {});
};

export default filterObject;
