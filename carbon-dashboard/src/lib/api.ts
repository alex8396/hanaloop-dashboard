export type GhgEmission = {
  yearMonth: string;  // "2025-01", "2025-02", "2025-03"
  source: string; // gasoline, lpg, diesel, 전기, 원소재, 운송 등
  emissions: number; // tons of CO2 equivalent
};

export type Company = {
  id: string;
  name: string;
  country: string; // Country.code
  emissions: GhgEmission[];
};

export type Post = {
  id: string;
  title: string;
  resourceUid: string; // Company.id
  dateTime: string;    // e.g., "2024-02"
  content: string;
};

export type Country = {
  code: string;
  name: string;
};

export const countries: Country[] = [
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  { code: "KR", name: "South Korea" }
];

export const companies: Company[] = [
  {
    id: "c1",
    name: "Acme Corp",
    country: "US",
    emissions: [
      { yearMonth: "2024-01", source: "gasoline", emissions: 120 }, 
      { yearMonth: "2024-02", source: "gasoline", emissions: 110 }, 
      { yearMonth: "2024-03", source: "gasoline", emissions: 95 }
    ]
  },
  {
    id: "c2",
    name: "Globex",
    country: "DE",
    emissions: [
      { yearMonth: "2024-01", source: "diesel", emissions: 80 }, 
      { yearMonth: "2024-02", source: "diesel", emissions: 105 }, 
      { yearMonth: "2024-03", source: "diesel", emissions: 120 }
    ]
  },
  {
    id: "c3",
    name: "Hana Manufacturing",
    country: "KR",
    emissions: [
      { yearMonth: "2025-01", source: "전기", emissions: 50.16 }, 
      { yearMonth: "2025-01", source: "플라스틱 1", emissions: 529 }, 
      { yearMonth: "2025-01", source: "트럭", emissions: 143.5 }
    ]
  }
];

export const posts: Post[] = [
  {
    id: "p1",
    title: "Sustainability Report",
    resourceUid: "c1",
    dateTime: "2024-02",
    content: "Quarterly CO2 update"
  }
];

let _countries = [...countries];
let _companies = [...companies];
let _posts = [...posts];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15; // 15% 실패 확률

export async function fetchCountries(): Promise<Country[]> {
  await delay(jitter());
  return _countries;
}

export async function fetchCompanies(): Promise<Company[]> {
  await delay(jitter());
  return _companies;
}

export async function fetchPosts(): Promise<Post[]> {
  await delay(jitter());
  return _posts;
}

export async function createOrUpdatePost(p: Omit<Post, "id"> & { id?: string }): Promise<Post> {
  await delay(jitter());
  if (maybeFail()) throw new Error("Save failed (Random failure for testing)");
  if (p.id) {
    _posts = _posts.map(x => x.id === p.id ? (p as Post) : x);
    return p as Post;
  }
  const created = { ...p, id: crypto.randomUUID() };
  _posts = [..._posts, created];
  return created;
}

export async function deletePost(id: string): Promise<void> {
  await delay(jitter());
  if (maybeFail()) throw new Error("Delete failed");
  _posts = _posts.filter(x => x.id !== id);
}
