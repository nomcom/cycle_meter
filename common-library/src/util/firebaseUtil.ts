import { ref, getBytes, FirebaseStorage } from "@firebase/storage";

/**
 * Firestorageの参照からデータURLを取得する
 * @param storage Firestorage
 * @param ref 参照
 * @param name ダウンロードファイル名
 */
export const getInStorageAsync = async (
  storage: FirebaseStorage,
  refId: string,
  param: BlobPropertyBag | undefined = undefined
) => {
  const storageRef = ref(storage, refId);
  const blob = new Blob([await getBytes(storageRef)], param);
  return URL.createObjectURL(blob);
};
