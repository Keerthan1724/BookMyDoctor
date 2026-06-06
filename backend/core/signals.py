from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.files.storage import default_storage
from core.models import User


@receiver(pre_save, sender=User)
def delete_old_profile_image(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_instance = User.objects.get(pk=instance.pk)
    except User.DoesNotExist:
        return

    old_image = old_instance.profile_image
    new_image = instance.profile_image

    if old_image and old_image != new_image:
        if default_storage.exists(old_image.name):
            default_storage.delete(old_image.name)
