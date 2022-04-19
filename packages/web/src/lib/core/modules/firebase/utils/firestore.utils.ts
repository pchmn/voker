import {
  DocumentSnapshot,
  FieldPath,
  orderBy,
  OrderByDirection,
  QueryConstraint,
  where,
  WhereFilterOp
} from 'firebase/firestore';
import { FirestoreDocument } from '../models/firestoreDocument.model';

export type Where = [fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown];
export type OrderBy = [fieldPath: string | FieldPath, directionStr: OrderByDirection];

export function castSnapshotToFirestoreDocument<T>(docSnap: DocumentSnapshot): FirestoreDocument<T> | undefined {
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as FirestoreDocument<T>) : undefined;
}

export function createWhereQuery(whereQuery?: Where | Where[]): QueryConstraint[] {
  if (!whereQuery) {
    return [];
  }
  if (Array.isArray(whereQuery)) {
    const queryConstraint = [];
    for (const query of whereQuery) {
      queryConstraint.push(where((query as Where)[0], (query as Where)[1], (query as Where)[2]));
    }
    return queryConstraint;
  }
  return [where(whereQuery[0], whereQuery[1], whereQuery[2])];
}

export function createOrderByQuery(orderByQuery?: string | OrderBy | OrderBy[]): QueryConstraint[] {
  if (!orderByQuery) {
    return [];
  }
  if (Array.isArray(orderByQuery)) {
    const queryConstraint = [];
    for (const query of orderByQuery) {
      queryConstraint.push(orderBy((query as OrderBy)[0], (query as OrderBy)[1]));
    }
    return queryConstraint;
  }
  if (typeof orderByQuery === 'string') {
    return [orderBy(orderByQuery)];
  }
  return [orderBy(orderByQuery[0], orderByQuery[1])];
}
