import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Textarea } from '@heroui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addToast } from '@heroui/react';
import { apiClient } from '../config/api';

const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(100, 'Workspace name must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
});

type CreateWorkspaceForm = z.infer<typeof createWorkspaceSchema>;

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
}: CreateWorkspaceModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async (data: CreateWorkspaceForm) => {
      return await apiClient.post('/workspaces', data);
    },    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces', 'memberships'],
      });
      addToast({
        title: 'Success',
        description: 'Workspace created successfully!',
        color: 'success',
      });
      reset();
      onClose();
    },
    onError: (error: any) => {
      addToast({
        title: 'Error',
        description: error?.message || 'Failed to create workspace',
        color: 'danger',
      });
    },
  });

  const onSubmit = (data: CreateWorkspaceForm) => {
    createWorkspaceMutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create New Workspace
            </ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <Input
                  {...register('name')}
                  label="Workspace Name"
                  placeholder="Enter workspace name"
                  variant="bordered"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  isRequired
                />
                <Textarea
                  {...register('description')}
                  label="Description"
                  placeholder="Enter workspace description (optional)"
                  variant="bordered"
                  isInvalid={!!errors.description}
                  errorMessage={errors.description?.message}
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Create Workspace
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
