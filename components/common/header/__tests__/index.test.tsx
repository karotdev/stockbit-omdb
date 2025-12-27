import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Header from "../";
import searchReducer from "@/redux/slices/search-slice";

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockGet = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

const mockGetMovieSuggestion = jest.fn();
jest.mock("../repo/use-get-movie-suggestion", () => ({
  __esModule: true,
  default: () => ({
    getMovieSuggestion: mockGetMovieSuggestion,
    data: [],
    loading: false,
    error: false,
    errorMessage: "",
  }),
}));

jest.mock("@/hooks/use-debounce", () => ({
  useDebounce: jest.fn(),
}));

const createTestStore = (initialKeyword = "") => {
  return configureStore({
    reducer: {
      search: searchReducer,
    },
    preloadedState: {
      search: {
        keyword: initialKeyword,
      },
    },
  });
};

const renderHeader = (initialKeyword = "") => {
  const store = createTestStore(initialKeyword);
  const utils = render(
    <Provider store={store}>
      <Header />
    </Provider>
  );
  return { ...utils, store };
};

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  describe("Rendering", () => {
    it("renders the logo/brand name", () => {
      renderHeader();
      expect(screen.getByText("StockBuster")).toBeInTheDocument();
    });

    it("renders the search input", () => {
      renderHeader();
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("renders the input group container", () => {
      renderHeader();
      const inputGroup = screen.getAllByRole("group");
      expect(inputGroup.length).toBeGreaterThan(0);
    });

    it("shows search button when keyword has value", () => {
      renderHeader("batman");
      expect(screen.getByText("Search")).toBeInTheDocument();
    });
  });

  describe("Search Input Behavior", () => {
    it("updates Redux store when typing in input", async () => {
      const { store } = renderHeader();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText("Search...");

      await user.type(input, "batman");

      expect(store.getState().search.keyword).toBe("batman");
    });

    it("displays the keyword value from Redux store", () => {
      renderHeader("spider-man");
      const input = screen.getByPlaceholderText(
        "Search..."
      ) as HTMLInputElement;
      expect(input.value).toBe("spider-man");
    });

    it("navigates to search page on Enter key press", async () => {
      renderHeader();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText("Search...");

      await user.type(input, "batman");
      await user.keyboard("{Enter}");

      expect(mockPush).toHaveBeenCalledWith("/search?s=batman");
    });

    it("navigates to search page when clicking Search button", async () => {
      renderHeader("batman");
      const user = userEvent.setup();
      const searchButton = screen.getByText("Search");

      await user.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith("/search?s=batman");
    });
  });

  describe("Clear/Reset Functionality", () => {
    it("clears keyword when clicking logo link", async () => {
      const { store } = renderHeader("batman");
      const user = userEvent.setup();
      const logoLink = screen.getByText("StockBuster");

      await user.click(logoLink);

      expect(store.getState().search.keyword).toBe("");
    });
  });

  describe("URL Keyword Sync", () => {
    it("syncs keyword from URL search params on mount", () => {
      mockGet.mockReturnValue("avengers");
      const { store } = renderHeader();

      expect(store.getState().search.keyword).toBe("avengers");
    });

    it("does not override Redux keyword if URL param is empty", () => {
      mockGet.mockReturnValue(null);
      const { store } = renderHeader("existing-keyword");

      expect(store.getState().search.keyword).toBe("existing-keyword");
    });

    it("syncs URL keyword even if Redux has different value", () => {
      mockGet.mockReturnValue("new-keyword");
      const { store } = renderHeader("old-keyword");

      expect(store.getState().search.keyword).toBe("new-keyword");
    });
  });

  describe("Logo Navigation", () => {
    it("logo links to home page", () => {
      renderHeader();
      const logoLink = screen.getByText("StockBuster");
      expect(logoLink.closest("a")).toHaveAttribute("href", "/");
    });
  });
});

describe("Header Component - Suggestions Dropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  it("does not show suggestions dropdown initially", () => {
    renderHeader("ab");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});

describe("Header Component - Outside Click", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  it("handles mousedown events", async () => {
    renderHeader("batman");

    fireEvent.mouseDown(document.body);

    expect(screen.getByText("StockBuster")).toBeInTheDocument();
  });
});
