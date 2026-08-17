import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { TrelloBoard, TrelloList, TrelloCard } from "./trelloTypes";

export class TrelloApiClient {
  private baseUrl = "https://api.trello.com/1";

  constructor(private request: APIRequestContext) {}

  // --- BOARDS ---

  async createBoard(name: string): Promise<TrelloBoard> {
    const res = await this.request.post(`${this.baseUrl}/boards`, {
      params: { name },
    });
    expect(
      res.ok(),
      `Failed to create board: ${res.statusText()}`,
    ).toBeTruthy();
    return res.json();
  }

  async getBoard(boardId: string): Promise<TrelloBoard> {
    const res = await this.request.get(`${this.baseUrl}/boards/${boardId}`);
    expect(res.ok(), `Failed to fetch board: ${res.statusText()}`).toBeTruthy();
    return res.json();
  }

  async updateBoard(
    boardId: string,
    updates: Partial<TrelloBoard>,
  ): Promise<TrelloBoard> {
    const res = await this.request.put(`${this.baseUrl}/boards/${boardId}`, {
      params: updates,
    });
    expect(
      res.ok(),
      `Failed to update board: ${res.statusText()}`,
    ).toBeTruthy();
    return res.json();
  }

  async deleteBoard(boardId: string): Promise<APIResponse> {
    const res = await this.request.delete(`${this.baseUrl}/boards/${boardId}`);
    expect(
      res.ok(),
      `Failed to delete board: ${res.statusText()}`,
    ).toBeTruthy();
    return res;
  }

  // --- LISTS ---

  async createList(boardId: string, name: string): Promise<TrelloList> {
    const res = await this.request.post(`${this.baseUrl}/lists`, {
      params: { name, idBoard: boardId },
    });
    expect(res.ok(), `Failed to create list: ${res.statusText()}`).toBeTruthy();
    return res.json();
  }

  async getList(listId: string): Promise<TrelloList> {
    const res = await this.request.get(`${this.baseUrl}/lists/${listId}`);
    expect(res.ok(), `Failed to fetch list: ${res.statusText()}`).toBeTruthy();
    return res.json();
  }

  async updateList(
    listId: string,
    updates: Partial<TrelloList>,
  ): Promise<TrelloList> {
    const res = await this.request.put(`${this.baseUrl}/lists/${listId}`, {
      params: updates,
    });
    expect(res.ok(), `Failed to update list: ${res.statusText()}`).toBeTruthy();
    return res.json();
  }

  async archiveList(listId: string): Promise<TrelloList> {
    return this.updateList(listId, { closed: true } as any);
  }

  // --- CARDS ---

  async createCard(
    listId: string,
    name: string,
    desc: string = "",
  ): Promise<TrelloCard> {
    const res = await this.request.post(`${this.baseUrl}/cards`, {
      params: { idList: listId, name, desc },
    });
    expect(res.ok(), `Failed to create card: ${res.statusText()}`).toBeTruthy();
    return res.json();
  }

  async getCard(cardId: string): Promise<TrelloCard> {
    const res = await this.request.get(`${this.baseUrl}/cards/${cardId}`);
    expect(res.ok(), `Failed to fetch card: ${res.statusText()}`).toBeTruthy();
    return res.json();
  }

  async updateCard(
    cardId: string,
    updates: Partial<TrelloCard>,
  ): Promise<TrelloCard> {
    const res = await this.request.put(`${this.baseUrl}/cards/${cardId}`, {
      params: updates,
    });
    expect(res.ok(), `Failed to update card: ${res.statusText()}`).toBeTruthy();
    return res.json();
  }

  async deleteCard(cardId: string): Promise<APIResponse> {
    const res = await this.request.delete(`${this.baseUrl}/cards/${cardId}`);
    expect(res.ok(), `Failed to delete card: ${res.statusText()}`).toBeTruthy();
    return res;
  }
}
