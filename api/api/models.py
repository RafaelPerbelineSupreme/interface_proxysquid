from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, User


class Sites(models.Model):
    site = models.CharField(max_length=50, unique=True, null=False)

    def __str__(self):
        return self.site

    def __unicode__(self):
        return self.site


class Grupos(models.Model):
    grupo = models.CharField(max_length=50, unique=True, blank=True, null=True)
    quantidade_usuarios = models.IntegerField(blank=True, null=True)
    isGrupoOpen = models.IntegerField(default=1, blank=True, null=True)

    def __str__(self):
        return self.grupo

    def __unicode__(self):
        return self.grupo


class User(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    email = models.CharField(max_length=30, unique=True)
    grupo = models.ForeignKey(Grupos, on_delete=models.CASCADE, blank=True, null=True)
