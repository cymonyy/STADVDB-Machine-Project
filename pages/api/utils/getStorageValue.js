export default function getStorageValue(key) {
	if (typeof window !== "undefined") {
		if (key === "node") {
			return localStorage.getItem("node");
		}
	}
}