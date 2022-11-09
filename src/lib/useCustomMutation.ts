import {
  MutationKey,
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useMutation,
  useIsMutating,
  useQueryClient,
} from "@tanstack/react-query";

export const useCustomMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
>(
  mutationKey: MutationKey,
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationKey" | "mutationFn"
  >,
): UseMutationResult<TData, TError, TVariables, TContext> & {
  invalidate: () => void;
} => {
  const invalidate = () => {
    queryClient.invalidateQueries(["CustomMutation", mutationKey]);
    queryClient.invalidateQueries(["CustomMutationError", mutationKey]);
  };

  const queryClient = useQueryClient();
  const query = useQuery<TData, TError>(
    ["CustomMutation", mutationKey],
    async () => await Promise.resolve(false as unknown as TData),
    {
      retry: false,
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  );
  const queryError = useQuery<TError, TData>(
    ["CustomMutationError", mutationKey],
    async () => await Promise.resolve(false as unknown as TError),
    {
      retry: false,
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  );
  const mutation = useMutation<TData, TError, TVariables, TContext>(
    mutationKey,
    async (...params) => {
      // TODO maybe sometimes invalidation should be optional?
      invalidate();

      queryClient.setQueryData(["CustomMutationError", mutationKey], false);
      return await mutationFn(...params);
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.setQueryData(["CustomMutation", mutationKey], data);
        if (options?.onSuccess) options.onSuccess(data, variables, context);
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["CustomMutationError", mutationKey], err);
        if (options?.onError) options.onError(err, variables, context);
      },
    },
  );
  const isLoading = useIsMutating(mutationKey);

  // We need typecasting here due the ADT about the mutation result, and as we're using a data not related to the mutation result
  // The typescript can't infer the type correctly.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    ...mutation,
    data: query.data,
    isLoading: !!isLoading,
    error: queryError.data,
    isError: !!queryError.data,
    invalidate: invalidate,
  } as UseMutationResult<TData, TError, TVariables, TContext> & {
    invalidate: () => void;
  };
};
