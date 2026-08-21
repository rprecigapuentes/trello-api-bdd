import { APIRequestContext, APIResponse } from '@playwright/test';
import { TrelloBoard, TrelloList, TrelloCard } from './trelloSchemas';
import { logger } from '@core';

export class TrelloApiClient {
  private baseUrl = 'https://api.trello.com/1';

  constructor(private request: APIRequestContext) {}

  // --- BOARDS ---

  async createBoard(name: string): Promise<TrelloBoard> {
    const res = await this.request.post(`${this.baseUrl}/boards`, {
      params: { name },
    });
    if (!res.ok()) {
      logger.error(`POST /1/boards failed with status ${res.status()} - ${res.statusText()}`);
      throw new Error(`Failed to create board: ${res.statusText()}`);
    }
    const data: TrelloBoard = await res.json();
    logger.debug(`POST /1/boards - Board ID created: '${data.id}'`);
    return data;
  }

  async getBoard(boardId: string): Promise<TrelloBoard> {
    const res = await this.request.get(`${this.baseUrl}/boards/${boardId}`);
    if (!res.ok()) {
      logger.error(
        `GET /1/boards/${boardId} failed with status ${res.status()} - ${res.statusText()}`,
      );
      throw new Error(`Failed to fetch board: ${res.statusText()}`);
    }
    logger.debug(`GET /1/boards/'${boardId}' - Status ${res.status()} OK`);
    return res.json();
  }

  async updateBoard(boardId: string, updates: Partial<TrelloBoard>): Promise<TrelloBoard> {
    const res = await this.request.put(`${this.baseUrl}/boards/${boardId}`, {
      params: updates,
    });
    if (!res.ok()) {
      logger.error(
        `PUT /1/boards/${boardId} failed with status ${res.status()} - ${res.statusText()}`,
      );
      throw new Error(`Failed to update board: ${res.statusText()}`);
    }
    logger.debug(`PUT /1/boards/'${boardId}' - Success`);
    return res.json();
  }

  async deleteBoard(boardId: string): Promise<APIResponse> {
    const res = await this.request.delete(`${this.baseUrl}/boards/${boardId}`);
    if (!res.ok()) {
      logger.error(
        `DELETE /1/boards/${boardId} failed with status ${res.status()} - ${res.statusText()}`,
      );
      throw new Error(`Failed to delete board: ${res.statusText()}`);
    }
    logger.debug(`DELETE /1/boards/'${boardId}' - Success`);
    return res;
  }

  // --- LISTS ---

  async createList(boardId: string, name: string): Promise<TrelloList> {
    const res = await this.request.post(`${this.baseUrl}/lists`, {
      params: { name, idBoard: boardId },
    });
    if (!res.ok()) {
      logger.error(`POST /1/lists failed with status ${res.status()} - ${res.statusText()}`);
      throw new Error(`Failed to create list: ${res.statusText()}`);
    }
    const data: TrelloList = await res.json();
    logger.debug(`POST /1/lists - List ID created: '${data.id}'`);
    return data;
  }

  async getList(listId: string): Promise<TrelloList> {
    const res = await this.request.get(`${this.baseUrl}/lists/${listId}`);
    if (!res.ok()) {
      logger.error(
        `GET /1/lists/${listId} failed with status ${res.status()} - ${res.statusText()}`,
      );
      throw new Error(`Failed to fetch list: ${res.statusText()}`);
    }
    logger.debug(`GET /1/lists/'${listId}' - Status ${res.status()} OK`);
    return res.json();
  }

  async updateList(listId: string, updates: Partial<TrelloList>): Promise<TrelloList> {
    const res = await this.request.put(`${this.baseUrl}/lists/${listId}`, {
      params: updates,
    });
    if (!res.ok()) {
      logger.error(
        `PUT /1/lists/${listId} failed with status ${res.status()} - ${res.statusText()}`,
      );
      throw new Error(`Failed to update list: ${res.statusText()}`);
    }
    logger.debug(`PUT /1/lists/'${listId}' - Success`);
    return res.json();
  }

  async archiveList(listId: string): Promise<TrelloList> {
    return this.updateList(listId, { closed: true });
  }

  // --- CARDS ---

  async createCard(listId: string, name: string, desc: string = ''): Promise<TrelloCard> {
    const res = await this.request.post(`${this.baseUrl}/cards`, {
      params: { idList: listId, name, desc },
    });
    if (!res.ok()) {
      logger.error(`POST /1/cards failed with status ${res.status()} - ${res.statusText()}`);
      throw new Error(`Failed to create card: ${res.statusText()}`);
    }
    const data: TrelloCard = await res.json();
    logger.debug(`POST /1/cards - Card ID created: '${data.id}'`);
    return data;
  }

  async getCard(cardId: string): Promise<TrelloCard> {
    const res = await this.request.get(`${this.baseUrl}/cards/${cardId}`);
    if (!res.ok()) {
      logger.error(
        `GET /1/cards/${cardId} failed with status ${res.status()} - ${res.statusText()}`,
      );
      throw new Error(`Failed to fetch card: ${res.statusText()}`);
    }
    logger.debug(`GET /1/cards/'${cardId}' - Status ${res.status()} OK`);
    return res.json();
  }

  async updateCard(cardId: string, updates: Partial<TrelloCard>): Promise<TrelloCard> {
    const res = await this.request.put(`${this.baseUrl}/cards/${cardId}`, {
      params: updates,
    });
    if (!res.ok()) {
      logger.error(
        `PUT /1/cards/${cardId} failed with status ${res.status()} - ${res.statusText()}`,
      );
      throw new Error(`Failed to update card: ${res.statusText()}`);
    }
    logger.debug(`PUT /1/cards/'${cardId}' - Success`);
    return res.json();
  }

  async deleteCard(cardId: string): Promise<APIResponse> {
    const res = await this.request.delete(`${this.baseUrl}/cards/${cardId}`);
    if (!res.ok()) {
      logger.error(
        `DELETE /1/cards/${cardId} failed with status ${res.status()} - ${res.statusText()}`,
      );
      throw new Error(`Failed to delete card: ${res.statusText()}`);
    }
    logger.debug(`DELETE /1/cards/'${cardId}' - Success`);
    return res;
  }
}
