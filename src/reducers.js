import {
  FAV_ADD,
  FAV_REMOVE,
  FETCH_SUCCESS,
  FETCH_LOADING,
  FETCH_ERROR,
  GET_FAVS_FROM_LS,
  CLEAR_LS,
} from "./actions";

import { toast } from "react-toastify";

const initial = {
  favs: [],
  current: null,
  error: null,
  loading: true,
};

let notifyToast;

function writeFavsToLocalStorage(state) {
  localStorage.setItem("s10g4", JSON.stringify(state.favs));
}

function clearAllLocalStorage(state) {
  localStorage.removeItem("s10g4");
}

function readFavsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("s10g4"));
}

export function myReducer(state = initial, action) {
  switch (action.type) {
    case FAV_ADD:
      const oldFav = state.favs.find((item) => item.id == action.payload.id);
      if (oldFav) {
        toast.error("Zaten favorilere eklendi");
        return state;
      } else {
        toast.success("Favorilere eklendi");
        const addFavState = { ...state, favs: [...state.favs, action.payload] };
        writeFavsToLocalStorage(addFavState);
        return addFavState;
      }

    case FAV_REMOVE:
      const removedFavState = {
        ...state,
        favs: state.favs.filter((item) => item.id !== action.payload),
      };
      writeFavsToLocalStorage(removedFavState);
      toast.error("Favorilerden kaldırıldı");
      return removedFavState;

    case FETCH_SUCCESS:
      toast.update(notifyToast, {
        render: "Veriler yüklendi",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return { ...state, current: action.payload, error: null, loading: false };

    case FETCH_LOADING:
      notifyToast = toast.loading("Yükleniyor...");
      return { ...state, current: null, error: null, loading: true };

    case FETCH_ERROR:
      toast.update(notifyToast, {
        render: "Hata: " + action.payload,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return { ...state, current: null, error: action.payload, loading: false };

    case GET_FAVS_FROM_LS:
      const favFromLS = readFavsFromLocalStorage();
      return { ...state, favs: favFromLS ? favFromLS : [] };

    case CLEAR_LS:
      toast.error("Tüm favoriler silindi");
      clearAllLocalStorage();
      return { ...state, favs: [] };
    default:
      return state;
  }
}
